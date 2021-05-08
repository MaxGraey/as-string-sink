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
    this.buffer = changetype<ArrayBuffer>(__new(
      <i32>max(size, MIN_BUFFER_SIZE),
      idof<ArrayBuffer>())
    );
    if (size) {
      memory.copy(
        changetype<usize>(this.buffer),
        changetype<usize>(initial),
        size
      );
      this.offset += size;
    }
  }

  get length(): i32 {
    return <i32>(this.offset >> 1);
  }

  get capacity(): i32 {
    return this.buffer.byteLength;
  }

  write(src: string, start: i32 = 0, end: i32 = i32.MAX_VALUE): void {
    let len = src.length as u32;

    if (start != 0 || end != i32.MAX_VALUE) {
      let from: i32;
      from  = min<i32>(max(start, 0), len);
      end   = min<i32>(max(end,   0), len);
      start = min<i32>(from, end);
      end   = max<i32>(from, end);
      len   = end - start;
    }

    if (!len) return;

    let size = len << 1;
    this.ensureCapacity(size);
    let offset = this.offset;

    memory.copy(
      changetype<usize>(this.buffer) + offset,
      changetype<usize>(src) + (<usize>start << 1),
      size
    );
    this.offset = offset + size;
  }

  writeLn(src: string, start: i32 = 0, end: i32 = i32.MAX_VALUE): void {
    let len = src.length as u32;

    if (start != 0 || end != i32.MAX_VALUE) {
      let from: i32;
      from  = min<i32>(max(start, 0), len);
      end   = min<i32>(max(end,   0), len);
      start = min<i32>(from, end);
      end   = max<i32>(from, end);
      len   = end - start;
    }

    if (!len) return;

    let size = len << 1;
    this.ensureCapacity(size + 2);

    let offset = this.offset;
    let dest = changetype<usize>(this.buffer) + offset;

    memory.copy(dest, changetype<usize>(src) + (<usize>start << 1), size);
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
    this.offset = 0;
    this.buffer = changetype<ArrayBuffer>(__renew(
      changetype<usize>(this.buffer),
      <i32>MIN_BUFFER_SIZE
    ));
  }

  shrink(): void {
    this.buffer = changetype<ArrayBuffer>(__renew(
      changetype<usize>(this.buffer),
      <i32>max(this.offset, MIN_BUFFER_SIZE)
    ));
  }

  toString(): string {
    let size = this.offset;
    if (!size) return "";
    let out = changetype<string>(__new(size, idof<string>()));
    memory.copy(changetype<usize>(out), changetype<usize>(this.buffer), size);
    return out;
  }

  @inline private ensureCapacity(deltaSize: u32): void {
    let oldSize = this.offset;
    let newSize = oldSize + deltaSize;
    if (newSize > <u32>this.capacity) {
      this.buffer = changetype<ArrayBuffer>(__renew(
        changetype<usize>(this.buffer),
        <i32>nextPowerOf2(newSize)
      ));
    }
  }
}
