import { Analyzer } from "./Analyzer";
import { ConfigProvider } from "./ConfigProvider";
import { HoverHelper } from "./HoverHelper";
import { XExp2 } from "./interpreter/model/XExp2";
import { XExpChild } from "./interpreter/model/XExpChild";
import { XParsedLine2 } from "./interpreter/model/XParsedLine";
import { DkDiag } from "./model/DkDiag";
import { DkSuggestion } from "./model/DkSuggestion";
import { SignatureHint } from "./model/SignatureHint";
import { XDescParam } from "./model/XDescParam";
import { XScriptAnalysis } from "./model/XScriptAnalysis";
import { SignatureHelper } from "./SignatureHelper";
import { SuggestionHelper } from "./SuggestionHelper";
import { TestUtils } from "./test/suite/TestUtils";
import { XAnalyzer } from "./XAnalyzer";

export type LineMap = (XParsedLine2 | undefined)[];

export type IndexedStatements = Array<[lineIndex: number, statement: XParsedLine2]>;

export interface ScriptChangeInfo {
    changes: IndexedStatements;
    shift: number;
    shiftIndex: number;
    documentLineCount: number;
}

export class ScriptInstance {
    private readonly lineMap: LineMap;
    private lineCount = 0;
    private uri: string;
    private analysis: XScriptAnalysis;

    constructor(uri: string) {
        this.uri = uri;
        this.lineMap = new Array();
        this.analysis = new XScriptAnalysis;
    }

    update(change: ScriptChangeInfo) {
        if (change.shift > 0) {
            for (let i = this.lineMap.length - 1; i >= change.shiftIndex; i--) {
                this.lineMap[i + change.shift] = this.lineMap[i];
            }
        }
        if (change.shift < 0) {
            for (let i = change.shiftIndex; i < this.lineMap.length; i++) {
                this.lineMap[i + change.shift] = this.lineMap[i];
            }
        }
        for (const [index, statement] of change.changes) {
            this.lineMap[index] = statement;
        }
        this.lineCount = change.documentLineCount;
    }

    performAnalysis(): XScriptAnalysis {
        return this.analysis = XAnalyzer.analyze(this.lineMap, this.lineCount);
        // return this.analysis = Analyzer.analyze(this.lineMap, this.lineCount);
    }

    collectDiagnostics(): DkDiag[] {
        const anl = this.performAnalysis();
        if (ConfigProvider.getConfig().diagEnabled) {
            if (anl.diagIgnoreLines.length) {
                return anl.diags.filter(diag => !anl.diagIgnoreLines.includes(diag.line));
            }
            return anl.diags;
        }
        return [];
    }

    suggest(line: number, pos: number): DkSuggestion[] {
        const s: XParsedLine2 | undefined = this.statementAt(line);

        if (s) {
            if (s.exp instanceof XExp2 && s.exp.getChildren().length && pos < s.exp.end) {
                const { child, index, leaf, ahead } = s.exp.getChildAtCursorPosition(pos);
                const leafDesc = leaf?.getDesc();
                // if cursor is within child && leaf command is recognized
                if (child && leafDesc) {
                    // if cursor is not behind last param
                    if (!(ahead && !leafDesc.params[index + 1])) {
                        return SuggestionHelper.suggestParams(
                            this.analysis,
                            ahead ? leafDesc.params[index + 1] : leafDesc.params[index]
                        );
                    }
                }
                return [];
            }
            return s.comment && pos < s.comment.start ? SuggestionHelper.suggestCommand(this.lineMap, line) : [];
        }
        return [];
    }

    hint(line: number, pos: number): SignatureHint | null {
        const statement = this.statementAt(line);
        return statement?.exp instanceof XExp2 ? SignatureHelper.getSignHelpForExp(statement.exp, pos) : null;
    }

    hover(line: number, pos: number): string | null {
        return null;
        // const statement = this.statementAt(line);
        // return statement ? HoverHelper.getHoverForExp(statement.exp, pos) : null;
    }

    print() {
        // console.table(this.lineMap.map((v, i) => [i, v?.exp?.value || '""']));
    }

    printLine(ln: number) {
        console.log(this.lineMap[ln]);
    }

    statementAt(ln: number): XParsedLine2 | undefined {
        return this.lineMap[ln];
    }

    getUri(): string {
        return this.uri;
    }
}