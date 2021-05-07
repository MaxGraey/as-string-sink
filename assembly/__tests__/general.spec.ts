import { StringSink } from "../index";

describe("general", () => {
  it("default constructor", () => {
    let sink = new StringSink;
    expect(sink.length).toBe(0);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("");
  });

  it("initial constructor", () => {
    let sink = new StringSink("hello");
    expect(sink.length).toBe(5);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("hello");
  });

  it("default constructor with one write", () => {
    let sink = new StringSink;
    sink.write("hello");
    expect(sink.length).toBe(5);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("hello");
  });

  it("initial constructor with one write", () => {
    let sink = new StringSink("hello");
    sink.write(" world!");
    expect(sink.length).toBe(12);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("hello world!");
  });

  it("initial constructor with one write with slice (1, 3)", () => {
    let sink = new StringSink("hello");
    sink.write("_world", 1, 3);
    expect(sink.length).toBe(7);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("hellowo");
  });

  it("initial constructor with one write with slice (-1, 3)", () => {
    let sink = new StringSink("hello");
    sink.write(" world!", -1, 3);
    expect(sink.length).toBe(8);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("hello wo");
  });

  it("initial constructor with one write with slice (4, -5)", () => {
    let sink = new StringSink("hello");
    sink.write(" world!", 4, -5);
    expect(sink.length).toBe(9);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("hello wor");
  });

  it("initial constructor with one write with slice (0, -2)", () => {
    let sink = new StringSink("hello");
    sink.write(" world!", 0, -2);
    expect(sink.length).toBe(5);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("hello");
  });

  it("default constructor with 16 writes", () => {
    let sink = new StringSink;
    let str = "";
    for (let i = 0; i < 16; i++) {
      sink.write(" stub ");
      str += " stub ";
    }
    expect(sink.length).toBe(6 * 16);    // 96
    expect(sink.capacity).toBe(128 * 2); // nextPOT(96) -> 128
    expect(sink.toString()).toBe(str);
  });

  it("default constructor with 2 writeLn", () => {
    let sink = new StringSink;
    sink.writeLn("hello");
    sink.writeLn("world");
    expect(sink.length).toBe(12);
    expect(sink.capacity).toBe(64); // default
    expect(sink.toString()).toBe("hello\nworld\n");
  });

  it("default constructor with several writeCodePoint", () => {
    let sink = new StringSink;
    sink.writeCodePoint("f".charCodeAt(0));
    sink.writeCodePoint("i".charCodeAt(0));
    sink.writeCodePoint("r".charCodeAt(0));
    sink.writeCodePoint("e".charCodeAt(0));
    sink.writeCodePoint(":".charCodeAt(0));
    sink.writeCodePoint("🔥".codePointAt(0));
    expect(sink.toString()).toBe("fire:🔥");
  });

  it("inial constructor with several writeCodePoint", () => {
    let spaces = " ".repeat(32);
    let sink = new StringSink(spaces);
    sink.writeCodePoint("f".charCodeAt(0));
    sink.writeCodePoint("i".charCodeAt(0));
    sink.writeCodePoint("r".charCodeAt(0));
    sink.writeCodePoint("e".charCodeAt(0));
    sink.writeCodePoint(":".charCodeAt(0));
    sink.writeCodePoint("🔥".codePointAt(0));
    expect(sink.toString()).toBe(spaces + "fire:🔥");
  });
});
