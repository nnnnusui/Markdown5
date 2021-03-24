import * as vscode from "vscode";
import Markdown5 from "markdown5";
import { Token, TokenKind, TokenValue } from "markdown5/dist/format/Types";

const id = "markdown5";
export function activate(context: vscode.ExtensionContext) {
  const symbol = vscode.languages.registerDocumentSymbolProvider(
    [{ language: id }],
    new SymbolProvider()
  );

  context.subscriptions.push(symbol);
}

export function deactivate() {}

class SymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) =>
      resolve(
        Markdown5.parse(document.getText()).flatMap((it) =>
          this.symbolFromToken(it, document)
        )
      )
    );
  }
  private symbolFromToken<T extends TokenKind>(
    token: Token<T>,
    document: vscode.TextDocument,
    parent = ""
  ) {
    const position = document.positionAt(token.offset);
    return this.searchSymbol(
      token,
      new vscode.Location(document.uri, position),
      document,
      parent
    );
  }
  private searchSymbol(
    token: TokenValue,
    location: vscode.Location,
    document: vscode.TextDocument,
    parent: string
  ): vscode.SymbolInformation[] {
    switch (token.kind) {
      default:
        return [];
      case "markdown5": {
        const { title, contents } = token.value;
        return [
          ...this.symbolFromToken(title, document, parent),
          ...contents.flatMap((it) =>
            this.symbolFromToken(it, document, title.value)
          ),
        ];
      }
      case "section": {
        const { header, contents } = token.value;
        return [
          ...this.symbolFromToken(header, document, parent),
          ...contents.flatMap((it) =>
            this.symbolFromToken(it, document, header.value)
          ),
        ];
      }
      case "sectionHeader":
        return [
          {
            containerName: parent,
            name: token.value,
            kind: vscode.SymbolKind.Key,
            location,
          },
        ];
    }
  }
}
