import { expect } from "chai";
import paragraph from "../../../format/tokenizer/paragraph";
import init from "../../../parser/combinator/util/init";
import Result from "../../../type/Result";

describe("paragraph test", () => {
  const p = paragraph("");

  it("line break between the text line are ignored", () =>
    expect(init(p)("line1\nline2".chars())).to.deep.equal(
      Result.ok({
        head: {
          offset: 0,
          kind: "paragraph",
          value: [
            {
              offset: 0,
              kind: "text",
              value: "line1",
            },
            {
              offset: 6,
              kind: "text",
              value: "line2",
            },
          ],
        },
        tail: {
          offset: 11,
          values: [],
        },
      })
    ));

  it("half-spaces paragraph indent", () =>
    expect(init(p)(" <- half-space".chars())).to.deep.equal(
      Result.ok({
        head: {
          offset: 0,
          kind: "paragraph",
          value: [
            {
              offset: 1,
              kind: "text",
              value: "<- half-space",
            },
          ],
        },
        tail: {
          offset: 14,
          values: [],
        },
      })
    ));

  it("full-spaces paragraph indent", () =>
    expect(init(p)("　<- 全角スペース".chars())).to.deep.equal(
      Result.ok({
        head: {
          offset: 0,
          kind: "paragraph",
          value: [
            {
              offset: 1,
              kind: "text",
              value: "<- 全角スペース",
            },
          ],
        },
        tail: {
          offset: 10,
          values: [],
        },
      })
    ));

  it("ends with a blank line", () =>
    expect(init(p)("1\n\n3".chars())).to.deep.equal(
      Result.ok({
        head: {
          offset: 0,
          kind: "paragraph",
          value: [
            {
              offset: 0,
              kind: "text",
              value: "1",
            },
          ],
        },
        tail: {
          offset: 2,
          values: ["\n", "3"],
        },
      })
    ));

  it("ends with a paragraph indent", () =>
    expect(init(p)("1\n 2".chars())).to.deep.equal(
      Result.ok({
        head: {
          offset: 0,
          kind: "paragraph",
          value: [
            {
              offset: 0,
              kind: "text",
              value: "1",
            },
          ],
        },
        tail: {
          offset: 2,
          values: [" ", "2"],
        },
      })
    ));
});
