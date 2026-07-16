import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { faker } from '@faker-js/faker';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { isObjectType } from 'graphql';
import type { GraphQLFieldResolver, GraphQLSchema } from 'graphql';
import { scalarMocks } from './mocks/scalar-mocks.js';
import { typeMocks } from './mocks/type-mocks.js';
import { defaultResolvers } from './mocks/scenarios/default.js';
import { emptyResolvers } from './mocks/scenarios/empty.js';

export type MockContext = {
    scenarioName: ScenarioName;
};

type ResolverFn = GraphQLFieldResolver<unknown, MockContext, Record<string, unknown>>;

export type ScenarioResolvers = Record<string, Record<string, ResolverFn>>;

const scenarios = {
    default: defaultResolvers,
    empty: emptyResolvers,
};

type ScenarioName = keyof typeof scenarios;

const defaultScenarioName: ScenarioName = 'default';
const defaultSeed = 12345;

export async function createMockSchema(request?: Request) {
    faker.seed(resolveMockSeed(request));

    const typeDefs = await loadTypeDefs(process.env.SCHEMA_PATH ?? './src/schema');
    const baseSchema = makeExecutableSchema({ typeDefs });

    return addMocksToSchema({
        schema: baseSchema,
        mocks: {
            ...scalarMocks,
            ...typeMocks,
        },
        resolvers: createScenarioResolvers(baseSchema),
        preserveResolvers: true,
    });
}

async function loadTypeDefs(schemaPath: string): Promise<string[]> {
    const schemaPathStat = await stat(schemaPath);

    if (schemaPathStat.isFile()) {
        return [await readFile(schemaPath, 'utf8')];
    }

    const graphqlFiles = await collectGraphqlFiles(schemaPath);

    return Promise.all(graphqlFiles.map((graphqlFile) => readFile(graphqlFile, 'utf8')));
}

async function collectGraphqlFiles(directoryPath: string): Promise<string[]> {
    const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
    const graphqlFiles = await Promise.all(
        directoryEntries.map(async (directoryEntry) => {
            const entryPath = join(directoryPath, directoryEntry.name);

            if (directoryEntry.isDirectory()) {
                return collectGraphqlFiles(entryPath);
            }

            if (directoryEntry.isFile() && entryPath.endsWith('.graphql')) {
                return [entryPath];
            }

            return [];
        }),
    );

    return graphqlFiles.flat().sort();
}

export function createMockContext(request: Request): MockContext {
    faker.seed(resolveMockSeed(request));

    return {
        scenarioName: resolveScenarioName(request),
    };
}

export function resolveScenarioName(request: Request): ScenarioName {
    const requestedScenario = request.headers.get('x-mock-scenario') ?? process.env.MOCK_SCENARIO;

    if (isScenarioName(requestedScenario)) {
        return requestedScenario;
    }

    return defaultScenarioName;
}

export function resolveMockSeed(request?: Request): number {
    const requestedSeed = request?.headers.get('x-mock-seed') ?? process.env.MOCK_SEED;
    const seed = Number(requestedSeed ?? defaultSeed);

    if (Number.isSafeInteger(seed)) {
        return seed;
    }

    return defaultSeed;
}

function createScenarioResolvers(schema: GraphQLSchema): ScenarioResolvers {
    const scenarioResolverEntries = Object.values(scenarios)
        .flatMap((scenarioResolvers) =>
            Object.entries(scenarioResolvers).flatMap(([typeName, fieldResolvers]) =>
                Object.keys(fieldResolvers).map((fieldName) => [typeName, fieldName] as const),
            ),
        )
        .filter(([typeName, fieldName]) => hasSchemaField(schema, typeName, fieldName));

    return scenarioResolverEntries.reduce<ScenarioResolvers>((resolvers, [typeName, fieldName]) => {
        resolvers[typeName] ??= {};
        resolvers[typeName][fieldName] = (root, args, context, info) => {
            const activeScenario = scenarios[context.scenarioName] ?? scenarios[defaultScenarioName];
            const resolver =
                activeScenario[typeName]?.[fieldName] ??
                scenarios[defaultScenarioName][typeName]?.[fieldName];

            return resolver?.(root, args, context, info);
        };

        return resolvers;
    }, {});
}

function hasSchemaField(schema: GraphQLSchema, typeName: string, fieldName: string): boolean {
    const type = schema.getType(typeName);

    return isObjectType(type) && fieldName in type.getFields();
}

function isScenarioName(value: string | undefined | null): value is ScenarioName {
    return value !== undefined && value !== null && value in scenarios;
}
