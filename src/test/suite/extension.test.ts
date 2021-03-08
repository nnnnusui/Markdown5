import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import Parser, {
  choose,
  symbol,
  chain,
  repeat,
  not,
} from "../../format/Parser";
// import * as myExtension from '../../extension';

suite("Parser Test Suite", () => {
  test("symbol", () => {
    const text = "ab";
    const a = symbol("a");
    const x = symbol("x");
    assert.strictEqual(a(text).ok, true);
    assert.strictEqual(x(text).ok, false);
  });
  test("not", () => {
    const text = "ab";
    const a = not("a");
    const x = not("x");
    assert.strictEqual(a(text).ok, false);
    assert.strictEqual(x(text).ok, true);
  });
  test("choose", () => {
    const aOrB = choose(symbol("a"), symbol("b"));
    assert.strictEqual(aOrB("ax").ok, true);
    assert.strictEqual(aOrB("bx").ok, true);
    assert.strictEqual(aOrB("xab").ok, false);
  });
  test("chain", () => {
    const aAndB = chain(symbol("a"), symbol("b"));
    assert.strictEqual(aAndB("ab").ok, true);
    assert.strictEqual(aAndB("bab").ok, false);
  });
  test("repeat", () => {
    const repA = repeat(symbol("a"));
    const repResult = repA("aaabababaa");
    assert.strictEqual(repResult.ok, true);
    if (repResult.ok) assert.strictEqual(repResult.get.result.join(""), "aaa");
    const repResult2 = repA("baab");
    assert.strictEqual(repResult.ok, true);
    if (repResult2.ok) assert.strictEqual(repResult2.get.result.join(""), "");
  });

  test("Parse test", () => {
    assert.strictEqual(
      Parser().parse(
        `
# てすと
    てすとです。
これはてすと。
      `
      ),
      ""
    );
  }); // Debug print
});
suite("Extension Test Suite", () => {
  // vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});
