import * as vscode from "vscode";
import Markdown5 from "markdown5";
import { Token, TokenKind, TokenValue } from "markdown5/dist/format/Types";

export class HighlightProvider implements vscode.DocumentHighlightProvider {
  static activate = (
    context: vscode.ExtensionContext,
    selector: vscode.DocumentSelector
  ): void => {
    const highlight = vscode.languages.registerDocumentHighlightProvider(
      selector,
      new HighlightProvider()
    );
    context.subscriptions.push(highlight);
  };

  public provideDocumentHighlights(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DocumentHighlight[]> {
    return new Promise((resolve, reject) =>
      resolve([
        new vscode.DocumentHighlight(
          new vscode.Range(
            new vscode.Position(1, 1),
            new vscode.Position(1, 5)
          ),
          vscode.DocumentHighlightKind.Text
        ),
        ...Markdown5.parse(document.getText()).flatMap((it) =>
          this.highlightFromToken(it, document)
        ),
      ])
    );
  }

  private highlightFromToken<T extends TokenKind>(
    _token: Token<T>,
    document: vscode.TextDocument
  ): vscode.DocumentHighlight[] {
    const token: TokenValue = _token;
    const offset = _token.offset;
    const position = document.positionAt(offset);
    const location = new vscode.Location(document.uri, position);
    switch (token.kind) {
      case "markdown5": {
        const { title, contents } = token.value;
        return [
          ...this.highlightFromToken(title, document),
          ...contents.flatMap((it) => this.highlightFromToken(it, document)),
        ];
      }
      case "section": {
        const { header, contents } = token.value;
        return [
          ...this.highlightFromToken(header, document),
          ...contents.flatMap((it) => this.highlightFromToken(it, document)),
        ];
      }
      case "sectionHeader":
        return [
          new vscode.DocumentHighlight(
            new vscode.Range(position, document.positionAt(offset + 2)),
            vscode.DocumentHighlightKind.Write
          ),
        ];
      default:
        return [];
    }
  }
}
