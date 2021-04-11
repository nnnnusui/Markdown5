import { expect } from "chai";
import link from "../../../format/tokenizer/link";
import init from "../../../parser/combinator/util/init";
import { ok } from "../../../type/Result";

describe("link test", () => {
  it("title href", () =>
    expect(
      init(link)("@link title http://example.com/href|".chars())
    ).to.deep.equal(
      ok({
        head: {
          offset: 0,
          kind: "link",
          value: {
            href: "http://example.com/href",
            title: "title",
          },
        },
        tail: {
          offset: 36,
          values: [],
        },
      })
    ));

  it("href only", () =>
    expect(init(link)("@link http://example.com/href|".chars())).to.deep.equal(
      ok({
        head: {
          offset: 0,
          kind: "link",
          value: {
            href: "http://example.com/href",
            title: "http://example.com/href",
          },
        },
        tail: {
          offset: 30,
          values: [],
        },
      })
    ));
});
