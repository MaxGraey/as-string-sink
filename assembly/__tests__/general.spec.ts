import { StringSink } from "../index";

describe("general", () => {
  it("default constructor", () => {
    let empty = new StringSink;
    expect(empty.length).toBe(0);
    expect(empty.capacity).toBe(64);
    expect(empty.toString()).toBe("");
  });

  it("initial constructor", () => {
    let empty = new StringSink("hello");
    expect(empty.length).toBe(5);
    expect(empty.capacity).toBe(64);
    expect(empty.toString()).toBe("hello");
  });

  it("default constructor with one write", () => {
    let empty = new StringSink;
    empty.write("hello");
    expect(empty.length).toBe(5);
    expect(empty.capacity).toBe(64);
    expect(empty.toString()).toBe("hello");
  });

  it("initial constructor with one write", () => {
    let empty = new StringSink("hello");
    empty.write(" world!");
    expect(empty.length).toBe(12);
    expect(empty.capacity).toBe(64);
    expect(empty.toString()).toBe("hello world!");
  });
});
