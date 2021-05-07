String Sink
===
[![Build Status](https://github.com/MaxGraey/as-string-sink/actions/workflows/test.yml/badge.svg?event=push)](https://github.com/MaxGraey/as-string-sink/actions/workflows/test.yml)

An efficient dynamically sized string buffer (aka **String Builder**) for AssemblyScript.

## Interface

```ts
class StringSink {
  constructor(initial: string = "");

  get length(): i32;
  get capacity(): i32;

  write(src: string): void;
  writeLn(src: string): void;
  writeCodePoint(code: i32): void;

  shrink(): void;
  clear(): void;

  toString(): string;
}
```

## Benchmark Results

StringSink can be 8700 times faster than naive string concatenation!

```json
100 strings:
------------
String += JS:  0.013401985168457031 ms
String += AS:  0.018011003732681274 ms
StringSink AS: 0.003363013267517090 ms

50,000 strings:
---------------
String += JS:  2.9322420060634613 ms
String += AS:  1238.5133749842644 ms
StringSink AS: 0.5659300088882446 ms

200,000 strings:
----------------
String += JS:  12.590546011924744 ms
String += AS:  19706.329459011555 ms
StringSink AS: 2.2581759989261627 ms
```

## Usage

non efficient example:

```ts
function toList(arr: string[]): string {
  let res = "";
  for (let i = 0, len = arr.length; i < len; i++) {
    res += arr[i] + "\n";
  }
  return res;
}
```

efficient with `StringSink`:

```ts
function toList(arr: string[]): string {
  let res = new StringSink();
  for (let i = 0, len = arr.length; i < len; i++) {
    res.write(arr[i] + "\n");
  }
  return res.toString();
}
```

even more efficient:

```ts
function toList(arr: string[]): string {
  let res = new StringSink();
  for (let i = 0, len = arr.length; i < len; i++) {
    res.writeLn(arr[i]);
  }
  return res.toString();
}
```

## TODO

- add benchmark
- add "start" and "end" optional arguments for write / writeLn
