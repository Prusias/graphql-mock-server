import { faker } from '@faker-js/faker';

export const scalarMocks = {
    ID: () => faker.string.uuid(),
    String: () => faker.lorem.words(3),
    Int: () => faker.number.int({ min: 1, max: 1000 }),
    Float: () => faker.number.float({ min: 1, max: 500, fractionDigits: 2 }),
    Boolean: () => faker.datatype.boolean(),
};
