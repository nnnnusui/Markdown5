import { expect } from "chai";
import sames from "../../../format/combinator/sames";
import init from "../../../parser/combinator/util/init";
import { ok } from "../../../parser/Types";

describe("sames test", () => {
  it('sames("tes") matches "tes"', () => {
    expect(init(sames("tes"))("test".chars())).to.deep.equal(
      ok({
        head: "tes",
        tail: {
          offset: 3,
          values: ["t"],
        },
      })
    );
  });

  it("allow empty string", () => {
    expect(init(sames(""))("test".chars())).to.deep.equal(
      ok({
        head: "",
        tail: {
          offset: 0,
          values: ["t", "e", "s", "t"],
        },
      })
    );
  });
});
