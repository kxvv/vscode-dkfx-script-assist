import { Exp } from "./Exp";

export interface Statement {
    exp?: Exp;
    comment?: string;
}