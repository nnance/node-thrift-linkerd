import * as hapi from "hapi";
import { graphqlHapi, graphiqlHapi } from "graphql-server-hapi";
import {GraphQLSchema, GraphQLObjectType, GraphQLString} from "graphql";

const thrift = require("thrift");
import * as Numbers from "../managed/Numbers";
import * as NumbersTypes from "../managed/Numbers_types";
import * as Calculator from "../managed/Calculator";

const graphqlPort = process.env.PORT || 3000;
const numAddr = splitAddress(process.env.NUMADDR || "localhost:9090");
const callAddr = splitAddress(process.env.CALCADDR || "localhost:9091");

function splitAddress(address: string): string[] {
  return address.indexOf(":") > -1 ? address.split(":") : [address];
}

// Create Thrift client
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const connection = thrift.createConnection(numAddr[0], numAddr[1] || 80, {
  max_attempts: 10,
  protocol: protocol,
  transport: transport,
});

connection.on("error", function(err) {
  console.error(err);
});

// Create a Numbers client with the connection
const numbers = thrift.createClient(Numbers, connection);

const calcConnection = thrift.createConnection(callAddr[0], callAddr[1] || 80, {
  max_attempts: 10,
  protocol: protocol,
  transport: transport,
});

calcConnection.on("error", function(err) {
  console.error(err);
});

// Create a Calculator client with the connection
const calculator = thrift.createClient(Calculator, calcConnection);

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    fields: {
      addition: {
        resolve: async (): Promise<number> => {
          let nums: NumbersTypes.GenerateResponse[] = await Promise.all([numbers.generate(), numbers.generate()]);
          return calculator.add(nums[0].id, nums[1].id);
        },
        type: GraphQLString,
      },
    },
    name: "Query",
  }),
});

// Create a server with a host and port
const server = new hapi.Server();

server.connection({
  host: "0.0.0.0",
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
  console.log(`open browser to http://localhost:${graphqlPort}/`);
});
