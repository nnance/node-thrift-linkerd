import * as hapi from "hapi";
import { graphqlHapi, graphiqlHapi } from "graphql-server-hapi";
import {GraphQLSchema, GraphQLObjectType, GraphQLString} from "graphql";

const thrift = require("thrift");
import * as Numbers from "../managed/Numbers";
import {MultipleResponse} from "../managed/Numbers_types";
import * as Calculator from "../managed/Calculator";
import {MultiplyRequest} from "../managed/Calculator_types";

const graphqlPort = process.env.PORT || 3000;
const numAddr = splitAddress(process.env.NUMADDR || "localhost:9090");
const callAddr = splitAddress(process.env.CALCADDR || "localhost:9091");

function splitAddress(address: string): string[] {
  return address.indexOf(":") > -1 ? address.split(":") : [address];
}

// Create Thrift client
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const createNumberClient = () => {
  const connection = thrift.createConnection(numAddr[0], numAddr[1] || 80, {
    max_attempts: 10,
    protocol: protocol,
    transport: transport,
  });

  connection.on("error", function(err) {
    console.error(err);
  });

  return thrift.createClient(Numbers, connection);
}

const createCalcClient = () => {
  const connection = thrift.createConnection(callAddr[0], callAddr[1] || 80, {
    max_attempts: 10,
    protocol: protocol,
    transport: transport,
  });

  connection.on("error", function(err) {
    console.error(err);
  });

  return thrift.createClient(Calculator, connection);
}


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    fields: {
      addition: {
        resolve: async (): Promise<number> => {
          let nums: MultipleResponse = await createNumberClient().generateMultiple();
          return createCalcClient().add(nums.first, nums.second);
        },
        type: GraphQLString,
      },
      multiply: {
        resolve: async (): Promise<number> => {
          let nums: number[] = await Promise.all([
            createNumberClient().generateSingle(),
            createNumberClient().generateSingle()
          ]);
          const request = new MultiplyRequest({
            x: nums[0],
            y: nums[1],
          });
          return createCalcClient().multiply(request);
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
