namespace java com.twitter.finagle.example.thriftjava
#@namespace scala com.twitter.finagle.example.thriftscala

struct GenerateResponse {
    1: required i32 id,
}


service Numbers {
  GenerateResponse generate();
}
