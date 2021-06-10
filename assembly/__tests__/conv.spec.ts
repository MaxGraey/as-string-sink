import { StringSink } from "../index";

describe("Conv", () => {
  const data = "abc";

  it("toArray", () => {
    const sink = new StringSink;
    sink.write(data);
    const expected: Array<u8> = [97, 0, 98, 0, 99, 0];

    let res = sink.to<Array<u8>>();
    expect(res).toHaveLength(data.length * 2);
    expect(res).toStrictEqual(expected);
  });

  it("toStaticArray", () => {
    const sink = new StringSink;
    sink.write(data);
    const out: Array<u8> = [97, 0, 98, 0, 99, 0];
    const expected = StaticArray.fromArray<u8>(out)

    let res = sink.to<StaticArray<u8>>();
    expect(res).toHaveLength(data.length * 2);
    expect(res).toStrictEqual(expected);
  })

  it("toArrayBuffer", () => {
    const sink = new StringSink;
    sink.write(data);
    const out: Array<u8> = [97, 0, 98, 0, 99, 0];
    const expected = changetype<ArrayBuffer>(out.dataStart);

    let res = sink.to<ArrayBuffer>();
    expect(res).toHaveLength(data.length * 2);
    expect(res).toStrictEqual(expected);
  })

  it("toUint8Array", () => {
    const sink = new StringSink;
    sink.write(data);
    const out: Array<u8> = [97, 0, 98, 0, 99, 0];
    const expected = Uint8Array.wrap(changetype<ArrayBuffer>(out.dataStart));

    let res = sink.to<Uint8Array>();
    expect(res).toHaveLength(data.length * 2);
    expect(res).toStrictEqual(expected);
  })
});
