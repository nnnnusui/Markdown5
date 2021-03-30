import * as vscode from "vscode";
import { CompileCommand } from "./CompileCommand";
import { SemanticProvider } from "./SemanticProvider";
import { SymbolProvider } from "./SymbolProvider";

const id = "markdown5";
const selector: vscode.DocumentSelector = { language: id };
export function activate(context: vscode.ExtensionContext): void {
  SymbolProvider.activate(context, selector);
  SemanticProvider.activate(context, selector);

  CompileCommand.activate(context, id);
  vscode.workspace.onDidSaveTextDocument((textDocument) => {});
}

export function deactivate(): void {}
