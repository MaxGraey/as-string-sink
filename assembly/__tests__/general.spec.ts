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

  it("default constructor with 16 writes", () => {
    let empty = new StringSink;
    let str = "";
    for (let i = 0; i < 16; i++) {
      empty.write(" stub ");
      str += " stub ";
    }
    expect(empty.length).toBe(6 * 16); // 96
    // expect(empty.capacity).toBe(256);
    expect(empty.toString()).toBe(str);
  });
});
