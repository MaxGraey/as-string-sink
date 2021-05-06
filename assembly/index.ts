const MIN_BUFFER_SIZE: u32 = 64;
const NEW_LINE_CHAR: u16 = 0x0A; // \n

// @ts-ignore: decorator
@inline function nextPowerOf2(n: u32): u32 {
  return 1 << 32 - clz(n - 1);
}

export class StringSink {
  private buffer: ArrayBuffer;
  private offset: u32 = 0;

  constructor(initial: string = "") {
    var size = <u32>initial.length << 1;
    this.buffer = new ArrayBuffer(<i32>max(size, MIN_BUFFER_SIZE));
    if (size) {
      memory.copy(changetype<usize>(this.buffer), changetype<usize>(initial), size);
      this.offset += size;
    }
  }

  get length(): i32 {
    return <i32>(this.offset >> 1);
  }

  get capacity(): i32 {
    return this.buffer.byteLength;
  }

  write(str: string): void {
    let len = str.length;
    if (!len) return;

    let size = len << 1;
    this.ensureCapacity(size);
    let offset = this.offset;

    memory.copy(changetype<usize>(this.buffer) + offset, changetype<usize>(str), size);
    this.offset = offset + size;
  }

  writeLn(str: string): void {
    let len = str.length;
    if (!len) return;

    let size = len << 1;
    this.ensureCapacity(size + 2);

    let offset = this.offset;
    let dest = changetype<usize>(this.buffer) + offset;

    memory.copy(dest, changetype<usize>(str), size);
    store<u16>(dest + size, NEW_LINE_CHAR);
    this.offset = offset + (size + 2);
  }

  writeCodePoint(code: i32): void {
    var hasSur = <u32>code > 0xFFFF;
    this.ensureCapacity(2 << i32(hasSur));

    let offset = this.offset;
    let dest = changetype<usize>(this.buffer) + offset;

    if (!hasSur) {
      store<u16>(dest, <u16>code);
      this.offset = offset + 2;
    } else {
      assert(<u32>code <= 0x10FFFF);
      code -= 0x10000;
      let hi = (code & 0x03FF) | 0xDC00;
      let lo = code >>> 10 | 0xD800;
      store<u32>(dest, lo | hi << 16);
      this.offset = offset + 4;
    }
  }

  clear(): void {
    this.buffer = new ArrayBuffer(<i32>MIN_BUFFER_SIZE);
    this.offset = 0;
  }

  shrink(): void {
    this.buffer = new ArrayBuffer(<i32>max(this.offset, MIN_BUFFER_SIZE));
  }

  toString(): string {
    let size = this.offset;
    if (!size) return "";
    let out = changetype<string>(__new(size, idof<string>()));
    memory.copy(changetype<usize>(out), changetype<usize>(this.buffer), size);
    return out;
  }

  @inline private ensureCapacity(deltaSize: i32): void {
    let oldSize = this.offset;
    let newSize = oldSize + deltaSize;
    if (newSize > <u32>this.capacity) {
      let newBuffer = new ArrayBuffer(<i32>nextPowerOf2(newSize));
      memory.copy(changetype<usize>(newBuffer), changetype<usize>(this.buffer), oldSize);
      this.buffer = newBuffer;
    }
  }
}
