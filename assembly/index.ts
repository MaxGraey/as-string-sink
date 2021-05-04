import { OBJECT, BLOCK_MAXSIZE, TOTAL_OVERHEAD } from "rt/common";

const MIN_BUFFER_SIZE: usize = 64;
const NEW_LINE_CHAR: u16 = 0xA; // \n

// @ts-ignore: decorator
@inline function nextPowerOf2(n: usize): usize {
  return 1 << 32 - clz(n - 1);
}

export class StringSink {
  private buffer: usize;
  private offset: usize = 0;

  constructor(initial: string = "") {
    var size = <usize>initial.length << 1;
    this.buffer = __new(max(size, MIN_BUFFER_SIZE), idof<string>());
    if (size) {
      memory.copy(this.buffer, changetype<usize>(initial), size);
      this.offset += size;
    }
  }

  get length(): i32 {
    return <i32>(this.offset >> 1);
  }

  get capacity(): i32 {
    return changetype<OBJECT>(changetype<usize>(this) - TOTAL_OVERHEAD).rtSize >> 1;
  }

  write(str: string): void {
    let len = str.length;
    if (!len) return;

    let size = len << 1;
    this.ensureCapacity(size);
    let offset = this.offset;
    memory.copy(this.buffer + offset, changetype<usize>(str), size);
    this.offset = offset + size;
  }

  writeLn(str: string): void {
    let len = str.length;
    if (!len) return;

    let size = len << 1;
    this.ensureCapacity(size + 2);
    let offset = this.offset;
    let dest = this.buffer + offset;
    memory.copy(dest, changetype<usize>(str), size);
    store<u16>(dest + size, NEW_LINE_CHAR);
    this.offset = offset + (size + 2);
  }

  writeCodePoint(code: i32): void {
    assert(<u32>code <= 0x10FFFF);

    var hasSur = i32(code > 0xFFFF);
    this.ensureCapacity(2 << hasSur);
    let dest = this.buffer + this.offset;
    if (!hasSur) {
      store<u16>(dest, <u16>code);
      this.offset += 2;
    } else {
      code -= 0x10000;
      let hi = (code & 0x03FF) | 0xDC00;
      let lo = (code >>> 10) | 0xD800;
      store<u32>(dest, lo | (hi << 16));
      this.offset += 4;
    }
  }

  clear(): void {
    this.buffer = __renew(this.buffer, MIN_BUFFER_SIZE);
    this.offset = 0;
  }

  shrink(): void {
    this.buffer = __renew(this.buffer, max(this.offset, MIN_BUFFER_SIZE));
  }

  toString(): string {
    let size = this.offset;
    if (!size) return "";
    let out = changetype<string>(__new(size, idof<string>()));
    memory.copy(changetype<usize>(out), this.buffer, size);
    return out;
  }

  @inline private ensureCapacity(deltaSize: usize): void {
    let requiredSize = this.offset + deltaSize;
    if (requiredSize > <usize>this.capacity) {
      let newCapacity = min(nextPowerOf2(requiredSize), BLOCK_MAXSIZE);
      this.buffer = __renew(this.buffer, newCapacity);
    }
  }
}
