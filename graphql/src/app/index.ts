import * as hapi from "hapi";
import { graphqlHapi, graphiqlHapi } from "graphql-server-hapi";
import {GraphQLSchema, GraphQLObjectType, GraphQLString} from "graphql";

import * as thrift from "thrift";
import * as Numbers from "./gen-nodejs/Numbers";
import * as Calculator from "./gen-nodejs/Calculator";

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

// Create a Numbers client with the connection
const numbers = thrift.createClient(Numbers, connection);

const calcConnection = thrift.createConnection("localhost", 9091, {
  max_retries: 10,
  protocol : protocol,
  transport : transport,
});

calcConnection.on("error", function(err) {
  console.error(err);
});

// Create a Calculator client with the connection
const calculator = thrift.createClient(Calculator, calcConnection);

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        fields: {
            testString: {
                resolve: async (): Promise<number> => {
                  let nums = await Promise.all([numbers.generate(), numbers.generate()]);
                  console.dir(nums);
                  return calculator.add(nums[0], nums[1]);
                },
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
