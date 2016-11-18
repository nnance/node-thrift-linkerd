namespace java com.twitter.finagle.example.thriftjava
#@namespace scala com.twitter.finagle.example.thriftscala

struct MultipleResponse {
    1: required i32 first,
    2: required i32 second,
}

service Numbers {
  i32 generateSingle();
  MultipleResponse generateMultiple();
}
