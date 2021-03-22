import { expect } from "chai";
import same from "../../../parser/combinator/minimum/same";
import option from "../../../parser/combinator/option";
import { init } from "../../../parser/combinator/util/init";

it("option test", () => {
  const a = option(same("a"));
  expect(init(a)("abb".split("")).head).to.deep.equal("a");
  expect(init(a)("bb".split("")).head).to.deep.equal(null);
});
