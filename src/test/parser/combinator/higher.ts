import { expect } from "chai";
import chainL from "../../../parser/combinator/chainL";
import chainR from "../../../parser/combinator/chainR";
import convert from "../../../parser/combinator/convert";
import higher from "../../../parser/combinator/higher";
import any from "../../../parser/combinator/minimum/any";
import same from "../../../parser/combinator/minimum/same";
import not from "../../../parser/combinator/not";
import repeat from "../../../parser/combinator/repeat";
import init from "../../../parser/combinator/util/init";
import Result from "../../../type/Result";

describe("higher test", () => {
  const char = chainR(not(same("}")), any<string>());
  const toClose = chainL(repeat(char), same("}"));
  const block = chainR(same("{"), toClose);
  const text = convert(repeat(char), (it) => it.join(""));
  it("higher target in braces", () =>
    expect(
      init(higher(block, text))("{inner content}".split(""))
    ).to.deep.equal(
      Result.ok({
        head: "inner content",
        tail: {
          offset: 15,
          values: [],
        },
      })
    ));

  it("check matches inner content", () =>
    expect(init(higher(block, same("t")))("{test}x".split(""))).to.deep.equal(
      Result.ok({
        head: "t",
        tail: {
          offset: 6,
          values: ["x"],
        },
      })
    ));
});
