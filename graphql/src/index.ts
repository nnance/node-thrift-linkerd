import * as hapi from "hapi";
import { graphqlHapi, graphiqlHapi } from "graphql-server-hapi";
import {GraphQLSchema, GraphQLObjectType, GraphQLString} from "graphql";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    fields: {
      testString: {
        resolve: () => "Hello world",
        type: GraphQLString,
      },
    },
    name: "Query",
  }),
});

// Create a server with a host and port
const server = new hapi.Server();
const graphqlPort = 3000;

server.connection({
  host: "localhost",
  port: graphqlPort,
});

server.register({
  options: {
    graphqlOptions: { schema },
    path: "/graphql",
  },
  register: graphqlHapi,
});

server.register({
  options: {
    graphiqlOptions: {
      endpointURL: "/graphql",
    },
    path: "/",
  },
  register: graphiqlHapi,
});

server.start(() => {
  console.log(`Server is listen on ${graphqlPort}`);
  console.log("open browser to http://localhost:3000/");
});
