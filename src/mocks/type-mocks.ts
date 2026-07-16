import { faker } from '@faker-js/faker';

export const typeMocks = {
    Product: () => ({
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price({ min: 1, max: 500 })),
    }),
    User: () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
    }),
};
