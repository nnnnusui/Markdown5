import * as vscode from 'vscode';

const id = "markdown5";
export function activate(context: vscode.ExtensionContext) {
	const symbol = vscode.languages.registerDocumentSymbolProvider([
		{ language: id },
	], new SymbolProvider());

	context.subscriptions.push(symbol);
}

export function deactivate() {}

class SymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
		return new Promise((resolve, reject) => resolve(
			[...Array(document.lineCount).keys()]
					.map((_, index)=> index)
					.map(index => document.lineAt(index))
					.map(line => {
						const match = this.pattern.exec(line.text);
						if (!match) {return null;}
						return {
							name: match[2],
							kind: vscode.SymbolKind.Class,
							location: new vscode.Location(document.uri, line.range)
						};
					})
					.filter((it): it is vscode.SymbolInformation => it !== null)
		));
    }

    private get pattern() {
        return /^(#) (.*)/gm;
    }
}