import { CommandDesc } from "./CommandDesc";
import { Exp } from "./Exp";
import { ScriptAnalysis } from "./ScriptAnalysis";

export interface ParamDiagProps {
    parent: Exp;
    parentDesc: CommandDesc;
    argDesc: CommandDesc | null;
    arg: Exp;
    argIndex: number;
    line: number;
    state: ScriptAnalysis;
}
