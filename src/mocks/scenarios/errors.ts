import type { ScenarioResolvers } from '../../mock-schema.js';

export const errorResolvers: ScenarioResolvers = {
    Query: {
        viewer: () => {
            throw new Error('Viewer is unavailable in the errors scenario.');
        },
        user: () => {
            throw new Error('User lookup failed in the errors scenario.');
        },
        products: () => {
            throw new Error('Product list failed in the errors scenario.');
        },
    },
};
