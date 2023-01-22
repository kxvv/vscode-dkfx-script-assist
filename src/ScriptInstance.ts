import { Analyzer } from "./Analyzer";
import { ConfigProvider } from "./ConfigProvider";
import { HoverHelper } from "./HoverHelper";
import { DkDiag } from "./model/DkDiag";
import { DkSuggestion } from "./model/DkSuggestion";
import { Exp } from "./model/Exp";
import { ParsedLine } from "./model/ParsedLine";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { SignatureHint } from "./model/SignatureHint";
import { SignatureHelper } from "./SignatureHelper";
import { SuggestionHelper } from "./SuggestionHelper";

export type LineMap = (ParsedLine | undefined)[];

export type IndexedStatements = Array<[lineIndex: number, statement: ParsedLine]>;

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
    private analysis: ScriptAnalysis;

    constructor(uri: string) {
        this.uri = uri;
        this.lineMap = new Array;
        this.analysis = new ScriptAnalysis;
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

    performAnalysis(): ScriptAnalysis {
        return this.analysis = Analyzer.analyze(this.lineMap, this.lineCount);
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
        const parsedLine: ParsedLine | undefined = this.statementAt(line);

        if (parsedLine) {
            if (parsedLine.exp instanceof Exp && parsedLine.exp.getChildren().length && pos < parsedLine.exp.end) {
                const { child, index, leaf, ahead } = parsedLine.exp.getChildAtCursorPosition(pos);
                const leafDesc = leaf?.getDesc();
                // if cursor is within child && leaf command is recognized
                if (child && leafDesc) {
                    // if cursor is not behind last param
                    if (!(ahead && !leafDesc.params[index + 1])) {
                        return SuggestionHelper.suggestParams(
                            this.analysis,
                            ahead ? leafDesc.params[index + 1] : leafDesc.params[index],
                            leaf,
                            ahead ? index + 1 : index
                        );
                    }
                }
                return [];
            }
            if (!parsedLine.comment || (parsedLine.comment && pos < parsedLine.comment.start)) {
                return SuggestionHelper.suggestCommand(this.lineMap, line);
            }
        }
        return [];
    }

    hint(line: number, pos: number): SignatureHint | null {
        const statement = this.statementAt(line);
        return statement?.exp instanceof Exp ? SignatureHelper.getSignHelpForExp(statement.exp, pos) : null;
    }

    hover(line: number, pos: number): string[] | null {
        const statement = this.statementAt(line);
        return statement ? HoverHelper.getHoverForExp(this.analysis, statement.exp, pos) : null;
    }

    print() {
        // console.table(this.lineMap.map((v, i) => [i, v?.exp?.value || '""']));
    }

    printLine(ln: number) {
        console.log(this.lineMap[ln]);
    }

    statementAt(ln: number): ParsedLine | undefined {
        return this.lineMap[ln];
    }

    getUri(): string {
        return this.uri;
    }
}