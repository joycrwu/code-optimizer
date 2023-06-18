// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { activate as forLoopHighlighterActivate } from './forLoopHighlighter';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "juice" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('juice.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const activeEditor = vscode.window.activeTextEditor;

		const decoration = vscode.window.createTextEditorDecorationType({
			backgroundColor: 'orange',
			opacity: '0.4',
			// border: '1px solid red',
		});

		if (activeEditor) {
			const text = activeEditor.document.getText();
			const searchString = 'example';
			const regex = new RegExp(searchString, 'g');
			const matches: vscode.Range[] = [];
			
			let match;
			while (match = regex.exec(text)) {
				const startPos = activeEditor.document.positionAt(match.index);
				const endPos = activeEditor.document.positionAt(match.index + match[0].length);
				const decorationRange = new vscode.Range(startPos, endPos);
				matches.push(decorationRange);
			}
			
			activeEditor.setDecorations(decoration, matches);
		}
	});

	context.subscriptions.push(disposable);

	forLoopHighlighterActivate(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
