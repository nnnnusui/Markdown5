import { expect } from "chai";
import any from "../../../parser/combinator/minimum/any";
import not from "../../../parser/combinator/not";
import init from "../../../parser/combinator/util/init";

it("not test", () => {
  const a = not(any<string>());
  expect(init(a)("a".split("")).ok).to.equal(false);
  expect(init(a)("b".split("")).ok).to.equal(false);
});
