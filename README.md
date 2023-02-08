String Sink
===
[![Build Status](https://github.com/MaxGraey/as-string-sink/actions/workflows/test.yml/badge.svg?event=push)](https://github.com/MaxGraey/as-string-sink/actions/workflows/test.yml?query=branch%3Amain)
[![npm](https://img.shields.io/npm/v/as-string-sink.svg?color=007acc&logo=npm)](https://www.npmjs.com/package/as-string-sink)

An efficient dynamically sized string buffer (aka **String Builder**) for AssemblyScript.

## Interface

```ts
class StringSink {
  static withCapacity(capacity: i32)

  constructor(initial: string = "", capacity: i32 = 32)

  get length(): i32
  get capacity(): i32

  // Append sting or substring
  write(src: string, start?: i32, end?: i32): void
  // Append sting or substring with new line
  writeLn(src?: string, start?: i32, end?: i32): void
  // Append single code point
  writeCodePoint(code: i32): void
  // Append any integer or floating point number
  writeNumber<T>(value: T): void

  reserve(capacity: i32, clear?: bool): void
  shrink(): void
  clear(): void

  // Convert buffer to normal string
  toString(): string
}
```

## Benchmark Results

StringSink can be up to 4000 times faster than naive string concatenation! And up to 6 times faster than JS concat which uses rope data structure under the hood.

100 strings:
------------
```ts
String += JS:  0.019 ms
String += AS:  0.016 ms
StringSink AS: 0.0043 ms `(4x)`
```

50,000 strings:
---------------
```ts
String += JS:  3.70 ms
String += AS:  526.16 ms
StringSink AS: 0.48 ms `(1096x)`
```

200,000 strings:
----------------
```ts
String += JS:  11.95 ms
String += AS:  8236.82 ms
StringSink AS: 2.01 ms `(4097x)`
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

Complex example:

```ts
function zipAndStringify(names: string[], ages: i32[]): string {
  assert(names.length == ages.length);

  let res = new StringSink();
  res.writeLn('[');
  for (let i = 0, len = names.length; i < len; i++) {
    res.write('  { name: "');
    res.write(names[i]);
    res.write('", age: ');
    res.writeNumber(ages[i]);
    res.writeLn(' },');
  }
  res.write(']');
  return res.toString();
}

assert(zipAndStringify(
  ["Alan", "Elon", "John D."],
  [109, 50, 51]
) == `[
  { name: "Alan", age: 109 },
  { name: "Elon", age: 50 },
  { name: "John D.", age: 51 },
]`);
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
