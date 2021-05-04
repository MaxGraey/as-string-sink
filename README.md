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

## Current status

_WIP_
