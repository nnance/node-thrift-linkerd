const thrift = require("thrift");
import * as Calculator from "../managed/Calculator";
import {MultiplyRequest} from "../managed/Calculator_types";

const port = process.env.PORT || 9091;

const server = thrift.createServer(Calculator, {
  add: function(x: number, y: number, result) {
    result(null, x + y);
  },
  multiply: function(request: MultiplyRequest, result) {
    result(null, request.x * request.y);
  },
});

server.listen(port);
