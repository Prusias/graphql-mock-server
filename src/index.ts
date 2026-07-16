import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { createMockContext, createMockSchema } from './mock-schema.js';

const port = Number(process.env.PORT ?? 4000);

const yoga = createYoga({
    schema: ({ request }) => createMockSchema(request),
    context: ({ request }) => createMockContext(request),
});

const server = createServer(yoga);

server.listen(port, () => {
    console.log(`Mock API: http://localhost:${port}/graphql`);
});
