import * as thrift from "thrift";
import * as Numbers from "./gen-nodejs/Calculator";

const port = process.env.PORT || 9091;

const server = thrift.createServer(Numbers, {
  add: function(x: number, y: number, result) {
    result(null, x + y);
  },
});

server.listen(port);
