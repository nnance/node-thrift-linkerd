const thrift = require("thrift");
import * as Calculator from "../managed/Calculator";

const port = process.env.PORT || 9091;

const server = thrift.createServer(Calculator, {
  add: function(x: number, y: number, result) {
    result(null, x + y);
  },
  multiply: function(x: number, y: number, result) {
    result(null, x * y);
  },
});

server.listen(port);
