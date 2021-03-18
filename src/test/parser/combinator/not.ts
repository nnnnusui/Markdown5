import { expect } from "chai";
import any from "../../../parser/combinator/minimum/any";
import not from "../../../parser/combinator/not";

it("not test", () => {
  const a = not(any<string>());
  expect(a("a".split("")).ok).to.equal(false);
  expect(a("b".split("")).ok).to.equal(false);
});
