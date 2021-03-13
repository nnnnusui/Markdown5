import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as myExtension from "../../extension";
import { parse } from "../../format/Parser";
import {
  any,
  chain,
  convert,
  not,
  or,
  repeat,
  same,
} from "../../parser/Combinators";

suite("Parser Test Suite", () => {
  test("any test", () => {
    const a = any<string>();
    assert.deepStrictEqual(a("a".split("")), {
      ok: true,
      head: "a",
      tails: [],
    });
    assert.deepStrictEqual(a("bc".split("")), {
      ok: true,
      head: "b",
      tails: ["c"],
    });
  });
  test("same test", () => {
    const a = same("a");
    assert.deepStrictEqual(a("ab".split("")), {
      ok: true,
      head: "a",
      tails: ["b"],
    });
    assert.deepStrictEqual(a("bb".split("")), {
      ok: false,
      head: "b",
      tails: ["b"],
    });
  });

  test("not test", () => {
    const a = not(any<string>());
    assert.strictEqual(a("a".split("")).ok, false);
    assert.strictEqual(a("b".split("")).ok, false);
  });
  test("repeat test", () => {
    const a = repeat(same("a"));
    assert.deepStrictEqual(a("aaaaxx".split("")), {
      ok: true,
      head: ["a", "a", "a", "a"],
      tails: ["x", "x"],
    });
    assert.deepStrictEqual(a("xax".split("")), {
      ok: true,
      head: [],
      tails: ["x", "a", "x"],
    });
  });
  test("convert test", () => {
    const a = convert(same(1), (it) => `${it}`);
    assert.deepStrictEqual(a([1, 2]), {
      ok: true,
      head: "1",
      tails: [2],
    });
  });

  test("chain test", () => {
    const a = chain(same("a"), same("b"));
    assert.deepStrictEqual(a("aba".split("")), {
      ok: true,
      head: ["a", "b"],
      tails: ["a"],
    });
    assert.deepStrictEqual(a("aaba".split("")), {
      ok: false,
      head: ["a"],
      tails: ["a", "b", "a"],
    });
    const x = convert(same("x"), (it) => ({ v: it }));
    const c = chain(a, x);
    assert.deepStrictEqual(c("abxc".split("")), {
      ok: true,
      head: [["a", "b"], { v: "x" }],
      tails: ["c"],
    });
  });
  test("or test", () => {
    const x = convert(same("x"), (it) => ({ v: it }));
    const a = repeat(or(same("a"), x));
    assert.deepStrictEqual(a("axab".split("")), {
      ok: true,
      head: ["a", { v: "x" }, "a"],
      tails: ["b"],
    });
  });

  test("Parse test", () =>
    assert.strictEqual(
      parse(`# Header1
    content1
      # Header2
      content2
    con1-2
    `),
      undefined
    )); // Debug print
});
