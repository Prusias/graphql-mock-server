# GraphQL Mock Server

GraphQL Yoga server backed by `@graphql-tools/mock`. The schema contract lives in SDL, GraphQL Tools generates fallback data for valid queries, and scenario resolvers override selected fields for static UI states or contract tests.

## Quick Setup

```sh
docker compose up
```

Open GraphiQL at [http://localhost:4000/graphql](http://localhost:4000/graphql).

## Project Structure

```text
src/
  schema/
    product.graphql
    query.graphql
    user.graphql
  mock-schema.ts
  mocks/
    scalar-mocks.ts
    type-mocks.ts
    scenarios/
      default.ts
      empty.ts
      errors.ts
      enterprise-customer.ts
```

## Mocking Model

- `src/schema/**/*.graphql` defines the GraphQL contract. Files are loaded recursively and merged into one executable schema.
- `src/mocks/scalar-mocks.ts` defines random scalar fallbacks.
- `src/mocks/type-mocks.ts` defines domain-realistic type defaults.
- `src/mocks/scenarios/*.ts` defines static or custom resolver behavior.

Use mocks for generic scalar and type-level generation. Use scenario resolvers when a response depends on arguments, parent values, request context, or named UI states.

By default the server loads every `.graphql` file under `src/schema`. Set `SCHEMA_PATH` to point at either a single `.graphql` file or another directory of `.graphql` files.

## Request Controls

The active scenario defaults to `default`, and the Faker seed defaults to `12345`.
Set defaults with environment variables:

```sh
MOCK_SCENARIO=enterprise MOCK_SEED=67890 npm run dev
```

Override them per GraphQL request with headers:

```sh
curl \
  -H 'content-type: application/json' \
  -H 'x-mock-scenario: empty' \
  -H 'x-mock-seed: 67890' \
  --data '{"query":"{ products { id name price available } }"}' \
  http://localhost:4000/graphql
```

Supported mock headers:

- `x-mock-scenario`: selects `default`, `empty`, `errors`, or `enterprise`.
- `x-mock-seed`: sets the Faker seed for that request.

Available scenarios:

- `default`
- `empty`
- `errors`
- `enterprise`

Use `x-mock-seed` to make Faker output reproducible for a specific request.

## Local Development

```sh
npm install
npm run dev
```

Validate TypeScript with:

```sh
npm run compile
```
