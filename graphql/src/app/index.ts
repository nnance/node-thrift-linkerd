import * as hapi from "hapi";
import { graphqlHapi, graphiqlHapi } from "graphql-server-hapi";
import {GraphQLSchema, GraphQLObjectType, GraphQLString} from "graphql";

import * as thrift from "thrift";
import * as Numbers from "./gen-nodejs/Numbers";

// Create Thrift client
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const connection = thrift.createConnection("localhost", 9090, {
  max_retries: 10,
  protocol : protocol,
  transport : transport,
});

connection.on("error", function(err) {
  console.error(err);
});

// Create a Calculator client with the connection
const client = thrift.createClient(Numbers, connection);

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        fields: {
            testString: {
                resolve: client.generate.bind(client),
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
