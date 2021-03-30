import * as vscode from "vscode";
import Markdown5 from "markdown5";
import { existsSync, mkdirSync, writeFile } from "fs";
import { dirname } from "path";

export class CompileCommand {
  static activate = (context: vscode.ExtensionContext, id: string): void => {
    const onDidSaveTextDocument = vscode.workspace.onDidSaveTextDocument(
      (document) => {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) return;
        const workspaceFolder = folders[0].uri;
        const outputUri = CompileCommand.getOutputUri(
          workspaceFolder,
          document.uri
        );
        const dir = dirname(outputUri.fsPath);
        // const edit = new vscode.WorkspaceEdit();
        // edit.createFile(outputUri, { ignoreIfExists: true });
        Markdown5.parse(document.getText()).map((it) => {
          const html = Markdown5.transpile(it);
          vscode.window.showInformationMessage(html);
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          writeFile(outputUri.fsPath, html, (err) =>
            err ? vscode.window.showErrorMessage(err.message) : ""
          );
        });
        // vscode.workspace.applyEdit(edit);
      }
    );
    context.subscriptions.push(onDidSaveTextDocument);
  };
  private static findMarkdown5Files() {
    return vscode.workspace
      .findFiles(`**/*.m5`)
      .then((m5) =>
        vscode.workspace
          .findFiles(`**/*.markdown5`)
          .then((markdown5) => [...m5, ...markdown5])
      );
  }
  private static createOutput(source: vscode.Uri) {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) return;
    const workspaceFolder = folders[0].uri;
    const outputUri = CompileCommand.getOutputUri(workspaceFolder, source);
    const edit = new vscode.WorkspaceEdit();
    edit.createFile(outputUri, { ignoreIfExists: true });

    vscode.workspace.openTextDocument(source).then((document) =>
      Markdown5.parse(document.getText()).map((it) => {
        const html = Markdown5.transpile(it);
        vscode.window.showInformationMessage(html);
        edit.insert(outputUri, new vscode.Position(0, 0), html);
        vscode.workspace.applyEdit(edit);
      })
    );
  }
  private static getOutputUri(workspace: vscode.Uri, source: vscode.Uri) {
    const relative = vscode.workspace.asRelativePath(source);
    const htmlPath = relative
      .replace(new RegExp(".m5$"), ".html")
      .replace(new RegExp(".markdown5$"), ".html");
    return vscode.Uri.joinPath(workspace, "out", htmlPath);
  }
}
