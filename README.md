String Sink
===

An efficient dynamically sized string buffer (aka **String Builder**) for AssemblyScript.

## Interface

```ts
class StringSink {
  constructor(initial: string = "");

  get length(): i32;
  get capacity(): i32;

  write(str: string): void;
  writeLn(str: string): void;
  writeCodePoint(code: i32): void;

  shrink(): void;
  clear(): void;

  toString(): string;
}
```

## Usage

non efficient example:

```ts
function toList(arr: string[]): string {
  let str = "";
  for (let i = 0, len = arr.length; i < len; i++) {
    str += arr[i] + "\n";
  }
  return str;
}
```

efficient with `StringSink`:

```ts
function toList(arr: string[]): string {
  let str = new StringSink();
  for (let i = 0, len = arr.length; i < len; i++) {
    str.write(arr[i] + "\n");
  }
  return str.toString();
}
```

even more efficient:

```ts
function toList(arr: string[]): string {
  let str = new StringSink();
  for (let i = 0, len = arr.length; i < len; i++) {
    str.writeLn(arr[i]);
  }
  return str.toString();
}
```

## Current status

_WIP_
