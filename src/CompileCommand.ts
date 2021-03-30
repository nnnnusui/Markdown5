import * as vscode from "vscode";
import Markdown5 from "markdown5";
import { existsSync, mkdirSync, writeFile } from "fs";
import { dirname } from "path";

export class CompileOnDidSaveTextDocument {
  static activate = (context: vscode.ExtensionContext): void => {
    const self = new CompileOnDidSaveTextDocument();
    const onDidSaveTextDocument = vscode.workspace.onDidSaveTextDocument(
      (document) => {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) return;
        const workspaceFolder = folders[0].uri;
        const outputUri = self.getOutputUri(workspaceFolder, document.uri);
        const dir = dirname(outputUri.fsPath);
        Markdown5.parse(document.getText()).map((it) => {
          const html = Markdown5.transpile(it);
          vscode.window.showInformationMessage(html);
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          writeFile(outputUri.fsPath, html, (err) =>
            err ? vscode.window.showErrorMessage(err.message) : ""
          );
        });
      }
    );
    context.subscriptions.push(onDidSaveTextDocument);
  };
  private getOutputUri(workspace: vscode.Uri, source: vscode.Uri) {
    const relative = vscode.workspace.asRelativePath(source);
    const htmlPath = relative
      .replace(new RegExp(".m5$"), ".html")
      .replace(new RegExp(".markdown5$"), ".html");
    return vscode.Uri.joinPath(workspace, "out", htmlPath);
  }
}
