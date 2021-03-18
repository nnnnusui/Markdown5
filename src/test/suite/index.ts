import { expect } from "chai";
import any from "../../parser/combinator/any";
import chain from "../../parser/combinator/chain";
import convert from "../../parser/combinator/convert";
import not from "../../parser/combinator/not";
import or from "../../parser/combinator/or";
import repeat from "../../parser/combinator/repeat";
import same from "../../parser/combinator/same";

describe("Parser Test Suite", () => {
  it("any test", () => {
    const a = any<string>();

    expect(a("a".split(""))).to.deep.equal({
      ok: true,
      head: "a",
      tails: [],
    });
    expect(a("bc".split(""))).to.deep.equal({
      ok: true,
      head: "b",
      tails: ["c"],
    });
  });
  it("same test", () => {
    const a = same("a");
    expect(a("ab".split(""))).to.deep.equal({
      ok: true,
      head: "a",
      tails: ["b"],
    });
    expect(a("bb".split(""))).to.deep.equal({
      ok: false,
      head: "b",
      tails: ["b"],
    });
  });

  it("not test", () => {
    const a = not(any<string>());
    expect(a("a".split("")).ok).to.equal(false);
    expect(a("b".split("")).ok).to.equal(false);
  });
  it("repeat test", () => {
    const a = repeat(same("a"));
    expect(a("aaaaxx".split(""))).to.deep.equal({
      ok: true,
      head: ["a", "a", "a", "a"],
      tails: ["x", "x"],
    });
    expect(a("xax".split(""))).to.deep.equal({
      ok: true,
      head: [],
      tails: ["x", "a", "x"],
    });
  });
  it("convert test", () => {
    const a = convert(same(1), (it) => `${it}`);
    expect(a([1, 2])).to.deep.equal({
      ok: true,
      head: "1",
      tails: [2],
    });
  });

  it("chain test", () => {
    const a = chain(same("a"), same("b"));
    expect(a("aba".split(""))).to.deep.equal({
      ok: true,
      head: ["a", "b"],
      tails: ["a"],
    });
    expect(a("aaba".split(""))).to.deep.equal({
      ok: false,
      head: ["a"],
      tails: ["a", "b", "a"],
    });
    const x = convert(same("x"), (it) => ({ v: it }));
    const c = chain(a, x);
    expect(c("abxc".split(""))).to.deep.equal({
      ok: true,
      head: [["a", "b"], { v: "x" }],
      tails: ["c"],
    });
  });
  it("or test", () => {
    const x = convert(same("x"), (it) => ({ v: it }));
    const a = repeat(or(same("a"), x));
    expect(a("axab".split(""))).to.deep.equal({
      ok: true,
      head: ["a", { v: "x" }, "a"],
      tails: ["b"],
    });
  });
});
