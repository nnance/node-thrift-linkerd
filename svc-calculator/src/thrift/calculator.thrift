namespace java com.twitter.finagle.example.thriftjava
#@namespace scala com.twitter.finagle.example.thriftscala

struct MultiplyRequest {
    1: required i32 x,
    2: required i32 y,
}

service Calculator {
  i32 add(1: i32 x, 2: i32 y);
  i32 multiply(1: MultiplyRequest request);
}
