import { faker } from '@faker-js/faker';
import type { ScenarioResolvers } from '../../mock-schema.js';

export const defaultResolvers: ScenarioResolvers = {
    Query: {
        viewer: () => ({
            id: 'user-current',
            name: 'Alice Example',
            email: 'alice@example.com',
            role: 'ADMIN',
        }),
        user: (_root, args) => ({
            id: String(args.id),
            name: args.id === '404' ? 'Missing User' : faker.person.fullName(),
            email: faker.internet.email(),
            role: 'MEMBER',
        }),
        products: () =>
            Array.from({ length: 5 }, (_item, index) => ({
                id: `product-${index + 1}`,
                available: index !== 2,
            })),
    },
    Product: {
        available: (parent) =>
            typeof parent === 'object' && parent !== null && 'available' in parent
                ? parent.available
                : true,
    },
};
