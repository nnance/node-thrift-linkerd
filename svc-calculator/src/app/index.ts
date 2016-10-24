import * as thrift from "thrift";
import * as Numbers from "./gen-nodejs/Calculator";

const server = thrift.createServer(Numbers, {
  add: function(x: number, y:number, result) {
    console.log("add");
    result(null, x + y);
  },
});

server.listen(9091);
