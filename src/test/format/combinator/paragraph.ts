import { expect } from "chai";
import paragraph from "../../../format/combinator/paragraph";
import init from "../../../parser/combinator/util/init";
import { ok } from "../../../parser/Types";

describe("paragraph test", () => {
  const p = paragraph("");

  it("line break between the text line are ignored", () =>
    expect(init(p)("line1\nline2".chars())).to.deep.equal(
      ok({
        head: {
          kind: "paragraph",
          value: "line1line2",
          offset: 0,
        },
        tail: {
          offset: 11,
          values: [],
        },
      })
    ));

  it("half-spaces paragraph indent", () =>
    expect(init(p)(" <- half-space".chars())).to.deep.equal(
      ok({
        head: {
          kind: "paragraph",
          value: "<- half-space",
          offset: 0,
        },
        tail: {
          offset: 14,
          values: [],
        },
      })
    ));

  it("full-spaces paragraph indent", () =>
    expect(init(p)("　<- 全角スペース".chars())).to.deep.equal(
      ok({
        head: {
          kind: "paragraph",
          value: "<- 全角スペース",
          offset: 0,
        },
        tail: {
          offset: 10,
          values: [],
        },
      })
    ));

  it("ends with a blank line", () =>
    expect(init(p)("1\n\n3".chars())).to.deep.equal(
      ok({
        head: {
          kind: "paragraph",
          value: "1",
          offset: 0,
        },
        tail: {
          offset: 2,
          values: ["\n", "3"],
        },
      })
    ));

  it("ends with a paragraph indent", () =>
    expect(init(p)("1\n 2".chars())).to.deep.equal(
      ok({
        head: {
          kind: "paragraph",
          value: "1",
          offset: 0,
        },
        tail: {
          offset: 2,
          values: [" ", "2"],
        },
      })
    ));
});
