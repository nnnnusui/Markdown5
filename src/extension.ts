import * as vscode from "vscode";
import { SemanticProvider } from "./SemanticProvider";
import { SymbolProvider } from "./SymbolProvider";

const id = "markdown5";
const selector: vscode.DocumentSelector = { language: id };
export function activate(context: vscode.ExtensionContext): void {
  SymbolProvider.activate(context, selector);
  SemanticProvider.activate(context, selector);
}

export function deactivate(): void {}
