import * as vscode from 'vscode';
import { MarkdownHeader } from "./MarkdownHeader";
export function activate(context: vscode.ExtensionContext) {

    let generateHeaderNumberDisposable = vscode.commands.registerCommand('extension.generateHeaderNumber', () => {
        // Get current active text editor
        const editor = vscode.window.activeTextEditor;
        // Show info if the open file is not a text file, or no file is opened
        if (!editor) {
            vscode.window.showInformationMessage('The open file is not a text file, or no file is opened');
            return;
        }
        // Get text
        const content = editor.document.getText();
        editor.edit(editBuilder => {
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(editor.document.lineCount + 1, 0);
            try {
                const newContent = MarkdownHeader.generateHeaderNumber(content);
                // Replace full content
                editBuilder.replace(new vscode.Range(start, end), newContent);
            } catch (err) {
                vscode.window.showInformationMessage(err.message);
            }
        });

    });
    context.subscriptions.push(generateHeaderNumberDisposable);

    let removeHeaderNumberDisposable = vscode.commands.registerCommand('extension.removeHeaderNumber', () => {
        // Get current active text editor
        const editor = vscode.window.activeTextEditor;
        // Show info if the open file is not a text file, or no file is opened
        if (!editor) {
            vscode.window.showInformationMessage('The open file is not a text file, or no file is opened');
            return;
        }
        // Get text
        const content = editor.document.getText();
        editor.edit(editBuilder => {
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(editor.document.lineCount + 1, 0);
            try {
                const newContent = MarkdownHeader.removeHeaderNumber(content);
                // Replace full content
                editBuilder.replace(new vscode.Range(start, end), newContent);
            } catch (err) {
                vscode.window.showInformationMessage(err.message);
            }
        });

    });
    context.subscriptions.push(removeHeaderNumberDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
