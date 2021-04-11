import { expect } from "chai";
import link from "../../../format/tokenizer/link";
import init from "../../../parser/combinator/util/init";
import { ok } from "../../../type/Result";

describe("link test", () => {
  it("", () =>
    expect(init(link)("@link,title,href.".chars())).to.deep.equal(
      ok({
        head: {
          offset: 0,
          kind: "link",
          value: {
            href: "href",
            title: "title",
          },
        },
        tail: {
          offset: 17,
          values: [],
        },
      })
    ));
});
