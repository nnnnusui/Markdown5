import * as vscode from "vscode";
import Markdown5 from "markdown5";
import { Token, TokenKind, TokenValue } from "markdown5/dist/format/Types";

export class SymbolProvider implements vscode.DocumentSymbolProvider {
  static activate = (
    context: vscode.ExtensionContext,
    selector: vscode.DocumentSelector
  ): void => {
    const symbol = vscode.languages.registerDocumentSymbolProvider(
      selector,
      new SymbolProvider()
    );
    context.subscriptions.push(symbol);
  };

  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Thenable<vscode.DocumentSymbol[]> {
    return new Promise((resolve, reject) =>
      resolve(
        Markdown5.parse(document.getText()).flatMap((it) =>
          this.symbolFromToken(it, document)
        )
      )
    );
  }
  private symbolFromToken<T extends TokenKind>(
    _token: Token<T>,
    document: vscode.TextDocument
  ): vscode.DocumentSymbol[] {
    const token: TokenValue = _token;
    const offset = _token.offset;
    const position = document.positionAt(offset);
    const location = new vscode.Location(document.uri, position);
    switch (token.kind) {
      case "markdown5": {
        const { title, contents } = token.value;
        return [
          ...this.symbolFromToken(title, document),
          ...contents.flatMap((it) => this.symbolFromToken(it, document)),
        ];
      }
      case "section": {
        const { header, contents } = token.value;
        return this.symbolFromToken(header, document).map((it) => {
          it.children = contents.flatMap((it) =>
            this.symbolFromToken(it, document)
          );
          return it;
        });
      }
      case "sectionHeader":
        return [
          new vscode.DocumentSymbol(
            token.value,
            "test",
            vscode.SymbolKind.Key,
            location.range,
            location.range
          ),
        ];
      default:
        return [];
    }
  }
}
