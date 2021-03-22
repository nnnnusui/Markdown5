import { expect } from "chai";
import same from "../../../parser/combinator/minimum/same";
import repeat from "../../../parser/combinator/repeat";
import { init } from "../../../parser/combinator/util/init";

it("repeat test", () => {
  const a = repeat(same("a"));
  expect(init(a)("aaaaxx".split("")).head).to.deep.equal(["a", "a", "a", "a"]);
  expect(init(a)("xax".split("")).head).to.deep.equal([]);
});
