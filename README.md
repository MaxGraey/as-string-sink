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

  write(src: string, start?: i32, end?: i32): void;
  writeLn(src: string, start?: i32, end?: i32): void;
  writeCodePoint(code: i32): void;

  shrink(): void;
  clear(): void;

  toString(): string;
}
```

## Benchmark Results

StringSink can be up to 8700 times faster than native string concatenation!

```json
100 strings:
------------
benchStringAccum: String += JS: 0.013 ms
benchStringAccum: String += AS: 0.021 ms
benchStringSinkAccum: StringSink AS: 0.0056 ms
benchStringSinkAccumSplit: StringSink AS: 0.0088 ms
benchStringSinkAccumUnsafe: StringSink AS Unsafe: 0.0064 ms
benchStringSinkAccumUnsafe2: StringSink AS Unsafe: 0.018 ms

50,000 strings:
---------------
benchStringAccum: String += JS: 0.46 ms
benchStringAccum: String += AS: 1397.41 ms
benchStringSinkAccum: StringSink AS: 0.87 ms
benchStringSinkAccumSplit: StringSink AS: 2.62 ms
benchStringSinkAccumUnsafe: StringSink AS Unsafe: 0.74 ms
benchStringSinkAccumUnsafe2: StringSink AS Unsafe: 0.52 ms

200,000 strings:
----------------
benchStringAccum: String += JS: 16.45 ms
benchStringAccum: String += AS: 34270.55 ms
benchStringSinkAccum: StringSink AS: 5.25 ms
benchStringSinkAccumSplit: StringSink AS: 11.02 ms
benchStringSinkAccumUnsafe: StringSink AS Unsafe: 3.15 ms
benchStringSinkAccumUnsafe2: StringSink AS Unsafe: 2.07 ms
```

## Usage 1. String accumulation (+=)

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

## Usage 2. String accumulation (+=) only part of string

non efficient example:

```ts
function toListSliced(arr: string[]): string {
  let res = "";
  for (let i = 0, len = arr.length; i < len; i++) {
    res += arr[i].substring(1, 3);
  }
  return res;
}
```

more efficient with `StringSink`:

```ts
function toListSliced(arr: string[]): string {
  let res = new StringSink();
  for (let i = 0, len = arr.length; i < len; i++) {
    res.write(arr[i], 1, 3);
  }
  return res.toString();
}
```
