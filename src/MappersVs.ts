import * as vscode from "vscode";
import { DkDiag } from "./model/DkDiag";
import { DkSuggestion } from "./model/DkSuggestion";
import { ErrSeverity } from "./model/ErrSeverity";
import { SignatureHint } from "./model/SignatureHint";

const ERR_MSG_PREFIXES: Readonly<{[key in ErrSeverity]: string}> = {
    [ErrSeverity.Hint]: "Hint",
    [ErrSeverity.Information]: "Info",
    [ErrSeverity.Warning]: "Warning",
    [ErrSeverity.Error]: "Error",
};

export class MappersVs {
    static diag(d: DkDiag): vscode.Diagnostic {
        return {
            message: `${ERR_MSG_PREFIXES[d.severity]}: ${d.msg}`,
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
