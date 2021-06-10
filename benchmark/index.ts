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

export function benchStringSinkAccum2(len: i32): i32 {
  let sink = new StringSink;
  sink.ensureCapacity(len * 4);
  for (let i = 0; i < len; i++) {
    sink.write(i & 1 ? "foo|" : "|boo");
  }
  return sink.toString().length;
}

export function benchStringSinkAccumSplit(len: i32): i32 {
  let sink = new StringSink;
  for (let i = 0; i < len; i++) {
    if (i & 1) {
      sink.write("f");
      sink.write("o");
      sink.write("o");
      sink.write("|");
    } else {
      sink.write("|");
      sink.write("b");
      sink.write("o");
      sink.write("o");
    }
  }
  return sink.toString().length;
}

export function benchStringSinkAccumUnsafe(len: i32): i32 {
  let sink = new StringSink;
  for (let i = 0; i < len; i++) {
    sink.ensureCapacity(4);
    sink.writeUnsafe(i & 1 ? "foo|" : "|boo");
  }
  return sink.toString().length;
}

export function benchStringSinkAccumUnsafe2(len: i32): i32 {
  let sink = new StringSink;
  sink.ensureCapacity(len * 4);
  for (let i = 0; i < len; i++) {
    sink.writeUnsafe(i & 1 ? "foo|" : "|boo");
  }
  return sink.toString().length;
}
