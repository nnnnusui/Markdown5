import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as myExtension from "../../extension";
import { parse } from "../../format/Parser";

suite("Parser Test Suite", () => {
  test("Parse test", () =>
    assert.strictEqual(parse("# Header").get, undefined)); // Debug print
});
