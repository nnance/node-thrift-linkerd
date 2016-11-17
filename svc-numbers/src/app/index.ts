const thrift = require("thrift");
import * as Numbers from "../managed/Numbers";
import { MultipleResponse } from "../managed/Numbers_types";

const port = process.env.PORT || 9090;

const randomizer = (bottom, top) => {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
};

const server = thrift.createServer(Numbers, {
  generateMultiple: (result) => {
    result(null, new MultipleResponse({
      first: randomizer(1, 10),
      second: randomizer(1, 10),
    }));
  },
  generateSingle: (result) => {
    result(null, randomizer(1, 10));
  },
});

server.listen(port);
