import * as vscode from "vscode";
import { DkDiag } from "./model/DkDiag";
import { DkSuggestion } from "./model/DkSuggestion";
import { SignatureHint } from "./model/SignatureHint";

export class MappersVs {
    static diag(d: DkDiag): vscode.Diagnostic {
        return {
            message: d.msg,
            range: new vscode.Range(d.line, d.start, d.line, d.end),
            severity: d.severity as unknown as vscode.DiagnosticSeverity,
        };
    }

    static dkSuggestion(s: DkSuggestion): vscode.CompletionItem {
        return s;
    }

    static signatureHelp(h: SignatureHint): vscode.SignatureHelp {
        return {
            activeParameter: h.active,
            activeSignature: 0,
            signatures: [{
                label: h.heading,
                parameters: h.params.map(p => ({
                    label: p,
                    // documentation: `${p}\nparam doc`
                })),
                documentation: new vscode.MarkdownString(h.doc)
            }]
        };
    }
}
