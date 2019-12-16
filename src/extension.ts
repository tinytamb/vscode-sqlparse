import * as vscode from "vscode";
import { PythonRunner } from "./python";
import * as fs from "fs";

class SqlParse implements vscode.DocumentFormattingEditProvider {

	private pythonObj: PythonRunner;

	constructor(context: vscode.ExtensionContext) {
		this.pythonObj = PythonRunner.getInstance(context);
	}

	provideDocumentFormattingEdits(document: vscode.TextDocument
		, options: vscode.FormattingOptions
		, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {

		// no editor
		if (!vscode.window.activeTextEditor) {
			return;
		}
		return this.pythonObj.parse(document);
	}
}

export function activate(context: vscode.ExtensionContext) {

	const format = new SqlParse(context);
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
			"sql", format
		)
	);
}

export function deactivate() { }
