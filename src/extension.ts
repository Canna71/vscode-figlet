'use strict';
import { Commenter } from './commenter';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "figlet" is now active!');
    let commenter = new Commenter(context);
    context.subscriptions.push(commenter);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('figlet.figlet', () => commenter.figlet());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('figlet.chooseFont', () => commenter.figlet_chooseFont());
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}