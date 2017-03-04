import { ExtensionContext, Range } from 'vscode';
import * as vscode from 'vscode';
import { EOL } from 'os';
import * as _ from 'lodash';
import * as figlet from 'figlet';



export class Commenter {

    private static countSpacesRegex = /^(\s*).*$/m;

    constructor(private context:ExtensionContext){
        
    }

    figlet_chooseFont() {

        figlet.fonts((err, fonts) => {
            if (err) {
                vscode.window.showErrorMessage(err.toString());
                return;
            }
            
             vscode.window.showQuickPick(fonts)
            .then(val => {
                this.context.globalState.update("figlet-font",val);
            });
        });


    }

    figlet() {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }
        var selection = editor.selection;
        var startLine = selection.start.line;
        var endLine = selection.end.line;
        var {lines, range} = this._getMultiLineRange(editor, startLine, endLine);

        var fontname = this.context.globalState.get("figlet-font") || undefined;

        var promises = lines.map((line) => new Promise<string>((resolve, reject) => {
            figlet.text(line,fontname, (err, data) => {
                if (err) resolve("")
                else resolve(data);
            })
        }));

        Promise.all(promises)
            .then((val) => {
                var newText = val.join(EOL);
                editor.edit(editBuilder => {
                    editBuilder.replace(range, newText);
                })
            })

    }

    dispose() {

    }

    private _getMultiLineRange(editor, startLine, endLine): { lines: string[], range: Range } {
        var lines = [];
        var range: Range = null;
        for (var l = startLine; l <= endLine; l++) {
            lines.push(editor.document.lineAt(l).text);
            if (!range) {
                range = editor.document.lineAt(l).range;
            } else {
                range = range.union(editor.document.lineAt(l).range);
            }
        }
        return { lines, range };
    }
}

