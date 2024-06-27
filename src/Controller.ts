import * as vscode from "vscode";
import { ConfigProvider } from "./ConfigProvider";
import { LANGUAGE_ID } from "./extension";
import { ControllerUtils } from "./ControllerUtils";
import { Parser } from "./interpreter/Parser";
import { Preparser } from "./interpreter/Preparser";
import { Tokenizer } from "./interpreter/Tokenizer";
import { MappersVs } from "./MappersVs";
import { ExtConfig } from "./model/ExtConfig";
import { ParsedLine } from "./model/ParsedLine";
import { IndexedStatements, ScriptChangeInfo, ScriptInstance } from "./ScriptInstance";

export class Controller {
    readonly diag: vscode.DiagnosticCollection;
    instances: { [uri: string]: ScriptInstance } = {};
    timeoutDiags: { [uri: string]: any } = {};
    timeoutRebuilds: { [uri: string]: any } = {};

    constructor() {
        this.diag = vscode.languages.createDiagnosticCollection(`${LANGUAGE_ID}-diag`);;
    }

    lineToDkStatement(line: string): ParsedLine {
        return Parser.parse(Preparser.preparse(Tokenizer.tokenize(line)));
    }

    createScriptChangeInfo(cc: vscode.TextDocumentContentChangeEvent, event: vscode.TextDocumentChangeEvent): ScriptChangeInfo {
        const [start, end] = [cc.range.start.line, cc.range.end.line];
        const result: ScriptChangeInfo = {
            changes: [],
            shift: 0,
            shiftIndex: 0,
            documentLineCount: event.document.lineCount
        };
        const newLineCount = [...cc.text.matchAll(/\n/g)].length;
        if (start === end && !newLineCount) {
            result.changes = [[start, this.lineToDkStatement(event.document.lineAt(start).text)]];
            return result;
        }
        const delLineCount = end - start;
        for (let i = start; i <= start + newLineCount; i++) {
            result.changes.push([
                i,
                this.lineToDkStatement(event.document.lineAt(i).text)
            ]);
        }
        result.shift = newLineCount - delLineCount;
        if (!result.shift) {
            return result;
        }
        if (delLineCount > newLineCount) {
            result.shiftIndex = end + 1;
        }
        if (newLineCount > delLineCount) {
            result.shiftIndex = start + 1;
        }
        return result;
    }

    queueDiagnostics(document: vscode.TextDocument) {
        const uri = document.uri.toString();
        clearTimeout(this.timeoutDiags[uri]);
        this.timeoutDiags[uri] = setTimeout(() => {
            this.diag.set(document.uri, this.instances[uri].collectDiagnostics().map(MappersVs.diag));
        }, ConfigProvider.getConfig().diagReactionTime);
    }

    rebuild(document: vscode.TextDocument) {
        const uri = document.uri.toString();
        this.instances[uri] = new ScriptInstance(uri);
        const changes: IndexedStatements =
            new Array(document.lineCount).fill(0)
                .map((item, idx) => [idx, this.lineToDkStatement(document.lineAt(idx).text)]);
        this.instances[uri].update({
            changes,
            shift: 0,
            shiftIndex: 0,
            documentLineCount: document.lineCount
        });
        this.queueDiagnostics(document);
    }

    setConfig() {
        ConfigProvider.setConfig(vscode.workspace.getConfiguration() as unknown as ExtConfig);
    }

    subscribe(context: vscode.ExtensionContext) {
        ControllerUtils.registerOnTextChangeListener(context, this);
        ControllerUtils.registerOnActiveEditorChangeListener(context, this);
        ControllerUtils.registerCompletionProvider(this);
        ControllerUtils.registerSignHelpProvider(this);
        ControllerUtils.registerHoverProvider(this);
        ControllerUtils.registerFormattingProvider(this);
        this.setConfig();

        vscode.window.onDidChangeActiveTextEditor(() => {
            if (vscode.window.activeTextEditor?.document?.languageId === LANGUAGE_ID) {
                this.setConfig();
            }
        });

        if (vscode.window.activeTextEditor?.document?.languageId === LANGUAGE_ID) {
            this.rebuild(vscode.window.activeTextEditor.document);
        }
    }
}

