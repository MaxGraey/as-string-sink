import { StringSink } from "../assembly/index";

export function benchStringAccum(len: i32): i32 {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += i & 1 ? "foo|" : "|boo";
  }
  return res.length;
}

export function benchStringSinkAccum(len: i32): i32 {
  let sink = new StringSink;
  for (let i = 0; i < len; i++) {
    sink.write(i & 1 ? "foo|" : "|boo");
  }
  return sink.toString().length;
}
