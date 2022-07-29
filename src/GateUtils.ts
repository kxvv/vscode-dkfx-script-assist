import * as vscode from "vscode";
import { LANGUAGE_ID } from "./extension";
import { Formatter } from "./Formatter";
import { Gate } from "./Gate";
import { MappersVs } from "./MappersVs";
import { ScriptInstance } from "./ScriptInstance";

export class GateUtils {
    static registerOnTextChangeListener(context: vscode.ExtensionContext, resolver: Gate) {
        vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
            if (event.document.languageId !== LANGUAGE_ID) {
                return;
            }
            const uri = event.document.uri.toString();
            event.contentChanges.forEach(cc => {
                if (!resolver.instances[uri]) {
                    resolver.rebuild(event.document);
                    return;
                }
                resolver.instances[uri].update(resolver.createScriptChangeInfo(cc, event));
                resolver.queueDiagnostics(event.document);
            });
        });
    }

    static registerOnActiveEditorChangeListener(context: vscode.ExtensionContext, resolver: Gate) {
        const onActiveChange = vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                if (editor.document.languageId !== LANGUAGE_ID) {
                    return;
                }
                const uri = editor.document.uri.toString();
                if (!resolver.instances[uri]) {
                    resolver.rebuild(editor.document);
                }
            }
        });
        if (context.subscriptions.indexOf(onActiveChange) === -1) {
            context.subscriptions.push(onActiveChange);
        }
    }

    static registerCompletionProvider(resolver: Gate) {
        vscode.languages.registerCompletionItemProvider(LANGUAGE_ID, {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
                const txt = document.lineAt(position.line).text;
                if (txt.startsWith("REM ") || txt.startsWith("rem ")) {
                    return [];
                }
                const uri = document.uri.toString();
                return resolver.instances[uri].suggest(position.line, position.character).map(MappersVs.dkSuggestion);
            }
        }, ",", "(", " ", "[");
    }

    static registerSignHelpProvider(resolver: Gate) {
        vscode.languages.registerSignatureHelpProvider(LANGUAGE_ID, {
            provideSignatureHelp(
                document: vscode.TextDocument,
                position: vscode.Position
            ) {
                const uri = document.uri.toString();
                const hint = resolver.instances[uri].hint(position.line, position.character);
                // console.log("hint for " + resolver.instance.printLine(position.line));
                // console.log(hint);
                return hint ? MappersVs.signatureHelp(hint) : hint;
            }
        }, ",", "(", " ", "[");
    }

    static registerHoverProvider(resolver: Gate) {
        vscode.languages.registerHoverProvider(LANGUAGE_ID, {
            provideHover(
                document: vscode.TextDocument,
                position: vscode.Position,
            ) {
                const uri = document.uri.toString();
                const hover = resolver.instances[uri]?.hover(position.line, position.character);
                if (hover) {
                    return new vscode.Hover(hover);
                }
                return null;
            }
        });
    }

    static registerFormattingProvider(resolver: Gate) {
        vscode.languages.registerDocumentFormattingEditProvider(LANGUAGE_ID, {
            provideDocumentFormattingEdits(
                document: vscode.TextDocument,
                options: vscode.FormattingOptions,
            ): vscode.TextEdit[] {
                const uri = document.uri.toString();
                const instance: ScriptInstance = resolver.instances[uri];
                if (instance) {
                    const lines: string[] = [];
                    for (let i = 0; i < document.lineCount; i++) {
                        lines.push(document.lineAt(i).text);
                    }
                    return Formatter.formatTextLines(lines)
                        .map((line, rowNum) => (new vscode.TextEdit(
                            new vscode.Range(
                                new vscode.Position(rowNum, 0),
                                new vscode.Position(rowNum, Number.MAX_SAFE_INTEGER)
                            ),
                            line
                        )));
                }
                return [];
            }
        });
    }
}
