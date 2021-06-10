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
---------------
benchStringAccumJS: String += JS: 0.029 ms
benchStringAccum: String += AS: 0.026 ms
benchStringSinkAccum: StringSink AS: 0.0063 ms
benchStringSinkAccum2: StringSink AS: 0.0055 ms
benchStringSinkAccumSplit: StringSink AS: 0.0093 ms       
benchStringSinkAccumUnsafe: tringSink AS Unsafe: 0.0049 ms
benchStringSinkAccumUnsafe2: tringSink AS Unsafe: 0.027 ms

50,000 strings:
---------------
benchStringAccumJS: String += JS: 0.64 ms
benchStringAccum: String += AS: 1384.81 ms
benchStringSinkAccum: StringSink AS: 1.29 ms
benchStringSinkAccum2: StringSink AS: 0.78 ms
benchStringSinkAccumSplit: StringSink AS: 2.65 ms
benchStringSinkAccumUnsafe: tringSink AS Unsafe: 0.85 ms
benchStringSinkAccumUnsafe2: tringSink AS Unsafe: 0.51 ms

200,000 strings:
---------------
benchStringAccumJS: String += JS: 16.79 ms
benchStringAccum: String += AS: 30619.66 ms
benchStringSinkAccum: StringSink AS: 3.55 ms
benchStringSinkAccum2: StringSink AS: 3.43 ms
benchStringSinkAccumSplit: StringSink AS: 12.12 ms
benchStringSinkAccumUnsafe: tringSink AS Unsafe: 3.16 ms
benchStringSinkAccumUnsafe2: tringSink AS Unsafe: 2.03 ms
Done in 37.20s.
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
