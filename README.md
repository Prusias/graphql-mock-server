# Quick setup:

Run `docker-compose up`

Open the Sandbox at [http://localhost:4000/](http://localhost:4000/)

To update the schema, edit the `schema/schema.graphql` file. The changes will be automatically applied in the sandbox.

Updating:
`git pull && docker-compose build`

# Usage:
Add any GraphQL schema to `schema/schema.graphql`, and save the file. The schema will automatically be loaded in the Apollo Sandbox, where you can run any type of query, mutation or subscription on automatically mocked data.

For any custom mocking, or the usage of custom scalars which require custom mocking. Add a mock for the scalar type to `schema/mocks.js`. Do this by adding a new line to the mocks object in the form of `scalar: () => value` where scalar is the object type and value could be any javascript value, or code returning a value. 

## Recommended VS Code plugin for GraphQL:
[Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo)

## Sandbox UI Example
![](https://res.cloudinary.com/apollographql/image/upload/e_sharpen:50,c_scale,q_90,w_1440,fl_progressive/v1655220888/odyssey/lift-off-part3/studio-query-start.png)