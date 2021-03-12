import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as myExtension from "../../extension";
import { parse } from "../../format/Markdown5";
import { any, not, same } from "../../parser/Combinators";

suite("Parser Test Suite", () => {
  test("any test", () => {
    assert.strictEqual(any("a").ok, true);
    assert.strictEqual(any("b").ok, true);
  });
  test("same test", () => {
    const a = same("a");
    assert.strictEqual(a("a").ok, true);
    assert.strictEqual(a("b").ok, false);
    assert.strictEqual(a("ab").ok, true);
    assert.strictEqual(a("bb").ok, false);
  });
  test("not test", () => {
    const a = not("a");
    assert.strictEqual(a("a").ok, false);
    assert.strictEqual(a("b").ok, true);
    assert.strictEqual(a("ab").ok, false);
    assert.strictEqual(a("bb").ok, true);
  });

  test("Parse test", () =>
    assert.strictEqual(
      parse(`# Header1
    content1
      # Header2
      content2
    con1-2
    `).get,
      undefined
    )); // Debug print
});
