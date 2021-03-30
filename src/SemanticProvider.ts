import * as vscode from "vscode";
import Markdown5 from "markdown5";
import { Token, TokenKind, TokenValue } from "markdown5/dist/format/Types";

type SemanticToken = Parameters<vscode.SemanticTokensBuilder["push"]>;
const types: string[] = ["header"];
const modifires: string[] = [];
const legend = new vscode.SemanticTokensLegend(types, modifires);
export class SemanticProvider implements vscode.DocumentSemanticTokensProvider {
  static activate = (
    context: vscode.ExtensionContext,
    selector: vscode.DocumentSelector
  ): void => {
    const semantic = vscode.languages.registerDocumentSemanticTokensProvider(
      selector,
      new SemanticProvider(),
      legend
    );
    context.subscriptions.push(semantic);
  };

  public provideDocumentSemanticTokens(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.SemanticTokens> {
    return new Promise((resolve, reject) => {
      const builder = new vscode.SemanticTokensBuilder(legend);
      Markdown5.parse(document.getText()).forEach((it) =>
        this.semanticFromToken(it, document).forEach((it) =>
          builder.push(...it)
        )
      );
      return resolve(builder.build());
    });
  }

  private semanticFromToken<T extends TokenKind>(
    _token: Token<T>,
    document: vscode.TextDocument
  ): SemanticToken[] {
    const token: TokenValue = _token;
    const offset = _token.offset;
    const position = document.positionAt(offset);
    const location = new vscode.Location(document.uri, position);
    switch (token.kind) {
      case "markdown5": {
        const { title, contents } = token.value;
        return [
          ...this.semanticFromToken(title, document),
          ...contents.flatMap((it) => this.semanticFromToken(it, document)),
        ];
      }
      case "section": {
        const { header, contents } = token.value;
        return [
          ...this.semanticFromToken(header, document),
          ...contents.flatMap((it) => this.semanticFromToken(it, document)),
        ];
      }
      case "sectionHeader":
        return [
          [
            new vscode.Range(position, document.positionAt(offset + 1)),
            "header",
          ],
        ];
      default:
        return [];
    }
  }
}
