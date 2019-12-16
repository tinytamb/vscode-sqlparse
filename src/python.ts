import * as vscode from "vscode";
import * as path from "path";
import { PythonShell } from "python-shell";
import * as fs from "fs";

export class PythonRunner {

	// scripts folder path
	private readonly scriptsDirName: string = "scripts";
	private readonly scriptsPath: string;
	private resultPromise: string[] = [];

	// instance
	private static instance: PythonRunner;

	// default PythonPath
	private pythonPath: string = "python";

    /**
     * constructor
     * @param _context
     */
	private constructor(private _context: vscode.ExtensionContext) {
		this.scriptsPath = this._context.asAbsolutePath(this.scriptsDirName);
	}

    /**
     * getInstance
     * @param context
     */
	static getInstance(context: vscode.ExtensionContext) {
		if (!PythonRunner.instance) {
			PythonRunner.instance = new PythonRunner(context);
		}
		return PythonRunner.instance;
	}

    /**
     * parse
     * @param document
     */
	public parse(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {

		const config = vscode.workspace.getConfiguration("sqlparse");

		// pythonPath
		const _pythonPath = config.get("pythonPath") as string;
		if (_pythonPath.length > 0) {
			this.pythonPath = _pythonPath;
		}

		// args setting
		const args: string[] = [];
		args[0] = this.getConfigSelectCase(config.get("keywordCase"));
		args[1] = this.getConfigSelectCase(config.get("identifierCase"));
		args[2] = config.get("stripComments") as string;
		args[3] = config.get("reindent") as string;
		args[4] = config.get("indentTabs") as string;
		args[5] = config.get("indentWidth") as string;
		args[6] = (config.get("outputFormat") as string).toLowerCase();


		const text = document.getText();
		// fullRange
		const range = new vscode.Range(0, 0, document.lineCount, 0);
		let targetRange = document.validateRange(range);

		// run
		return this.workPython(targetRange, text, args);
	}


	/**
	 * select case
	 * @param selected selected text
	 */
	private getConfigSelectCase(selected?: string): string {
		let result: string = "";
		const key = selected as string;
		switch (key) {
			case "Upper case":
				result = "upper";
				break;
			case "Lower case":
				result = "lower";
				break;
			case "Capitalize":
				result = "capitalize";
				break;
		}
		return result;
	}

	/**
	 * check Python
	 */
	private checkPython(): Promise<boolean> {
		return fs.promises.access(this.pythonPath)
			.then(() => {
				return true;
			})
			.catch((err) => {
				console.log(err.message);
				return false;
			});
	}

	/**
	 * use python
	 * @param targetRange 
	 * @param text 
	 * @param args
	 */
	private async workPython(targetRange: vscode.Range, text: string, args: string[]): Promise<vscode.TextEdit[]> {

		// python path check
		const checkPython = await this.checkPython();
		if (!checkPython) {
			vscode.window.showErrorMessage("Python does not exist.[" + this.pythonPath + "]");
			return Promise.resolve([]);
		}

		// init
		this.resultPromise = [];
		let pyShell = this.createPythonShell("run.py", { mode: 'text', args: args });

		try {
			await this.runPython(pyShell, text);
		} catch (error) {
			vscode.window.showErrorMessage(error.message);
			console.log(error.message);
			return Promise.resolve([]);
		}

		return Promise.resolve([
			new vscode.TextEdit(targetRange, this.resultPromise.join("\n"))
		]);

	}

	/**
	 * run python
	 * @param pyShell PythonShell Object
	 * @param command command
	 */
	private runPython(pyShell: PythonShell, command: string)
		: Promise<string | Error> {

		return new Promise((resolve, reject) => {

			pyShell.send(command);
			pyShell.on("message", (message: string) => {
				this.resultPromise.push(message);
				resolve(message);
			});

			// error
			pyShell.end((error: Error) => {
				if (error) {
					reject(error);
				} else {
					reject(new Error("Something bad happened."));
				}
			});
		});
	}

    /**
     * create PythonShell
     * @param fileName python file name
     * @param opt
     */
	private createPythonShell(fileName: string, opt: object = {}): PythonShell {
		return new PythonShell(
			this.getPythonFilePath(fileName),
			Object.assign(opt, { pythonPath: this.pythonPath })
		);
	}

    /**
     * Python file path
     * @param fileName python file name
     */
	private getPythonFilePath(fileName: string): string {
		return path.join(this.scriptsPath, fileName);
	}

}
