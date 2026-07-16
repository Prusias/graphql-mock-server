import type { ScenarioResolvers } from '../../mock-schema.js';

export const emptyResolvers: ScenarioResolvers = {
    Query: {
        viewer: () => ({
            id: 'user-empty',
            name: 'Empty Scenario',
            email: 'empty@example.com',
            role: 'MEMBER',
        }),
        user: () => null,
        products: () => [],
    },
};
