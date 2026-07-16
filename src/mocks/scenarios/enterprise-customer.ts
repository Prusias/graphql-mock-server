import type { ScenarioResolvers } from '../../mock-schema.js';

export const enterpriseCustomerResolvers: ScenarioResolvers = {
    Query: {
        viewer: () => ({
            id: 'user-enterprise-admin',
            name: 'Evelyn Enterprise',
            email: 'evelyn.enterprise@example.com',
            role: 'ADMIN',
        }),
        user: (_root, args) => ({
            id: String(args.id),
            name: 'Morgan Member',
            email: 'morgan.member@example.com',
            role: 'MEMBER',
        }),
        products: () => [
            {
                id: 'enterprise-seat',
                name: 'Enterprise Seat',
                price: 199,
                available: true,
            },
            {
                id: 'priority-support',
                name: 'Priority Support',
                price: 499,
                available: true,
            },
        ],
    },
};
