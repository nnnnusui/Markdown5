import * as vscode from "vscode";
import { SymbolProvider } from "./SymbolProvider";

const id = "markdown5";
export function activate(context: vscode.ExtensionContext) {
  const symbol = vscode.languages.registerDocumentSymbolProvider(
    [{ language: id }],
    new SymbolProvider()
  );

  context.subscriptions.push(symbol);
}

export function deactivate() {}
