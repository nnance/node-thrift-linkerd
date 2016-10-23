import * as thrift from "thrift";
import * as Numbers from "./gen-nodejs/Numbers";

const server = thrift.createServer(Numbers, {
  generate: function(result) {
    function getRandomizer(bottom, top) {
      return () => Math.floor(Math.random() * (1 + top - bottom)) + bottom;
    }
    console.log("generate");
    const randomizer = getRandomizer(1, 10);
    result(null, randomizer());
  },
});

server.listen(9090);
