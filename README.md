String Sink
===
[![Build Status](https://github.com/MaxGraey/as-string-sink/actions/workflows/test.yml/badge.svg?event=push)](https://github.com/MaxGraey/as-string-sink/actions/workflows/test.yml?query=branch%3Amain)
[![npm](https://img.shields.io/npm/v/as-string-sink.svg?color=007acc&logo=npm)](https://www.npmjs.com/package/as-string-sink)

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

StringSink can be up to 8700 times faster than naive string concatenation!

```json
100 strings:
------------
String += JS:  0.016 ms
String += AS:  0.018 ms
StringSink AS: 0.0033 ms

50,000 strings:
---------------
String += JS:  2.86 ms
String += AS:  1133.24 ms
StringSink AS: 0.57 ms

200,000 strings:
----------------
String += JS:  11.44 ms
String += AS:  17867.35 ms
StringSink AS: 2.06 ms
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

- add "start" and "end" optional arguments for write / writeLn
