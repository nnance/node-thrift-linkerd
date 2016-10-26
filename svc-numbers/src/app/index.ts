import * as thrift from "thrift";
import * as Numbers from "./gen-nodejs/Numbers";

const port = process.env.PORT || 9090;

const randomizer = (bottom, top) => {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
};

const server = thrift.createServer(Numbers, {
  generate: (result) => {
    result(null, randomizer(1, 10));
  },
});

server.listen(port);
