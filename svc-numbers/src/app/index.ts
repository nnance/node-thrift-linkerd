const thrift = require("thrift");
import * as Numbers from "../managed/Numbers";
import { GenerateResponse } from "../managed/Numbers_types";

const port = process.env.PORT || 9090;

const randomizer = (bottom, top) => {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
};

const server = thrift.createServer(Numbers, {
  generate: (result) => {
    result(null, new GenerateResponse({
      id: randomizer(1, 10),
    }));
  },
});

server.listen(port);
