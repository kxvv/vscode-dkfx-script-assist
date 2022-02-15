import * as vscode from "vscode";
import { LANGUAGE_ID } from "./extension";
import { MappersVs } from "./MappersVs";
import { Resolver } from "./Resolver";

export class ResolverUtils {
    static registerOnTextChangeListener(context: vscode.ExtensionContext, resolver: Resolver) {
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

    static registerOnActiveEditorChangeListener(context: vscode.ExtensionContext, resolver: Resolver) {
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

    static registerCompletionProvider(resolver: Resolver) {
        vscode.languages.registerCompletionItemProvider(LANGUAGE_ID, {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
                const uri = document.uri.toString();
                return resolver.instances[uri].suggest(position.line, position.character).map(MappersVs.dkSuggestion);
            }
        }, ",", "(", " ", "[");
    }

    static registerSignHelpProvider(resolver: Resolver) {
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

    static registerHoverProvider(resolver: Resolver) {
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
}
