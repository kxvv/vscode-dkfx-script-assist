import { CommandDesc } from "../../model/CommandDesc";
import { DescProvider } from "../../DescProvider";
import { ExpChild } from "./ExpChild";

export class Word {
    val: string;
    start: number;
    end: number;
    parent: ExpChild | null;

    constructor(parent: ExpChild | null, val: string, start: number) {
        this.val = val;
        this.start = start;
        this.end = start + val.length;
        this.parent = parent;
    }

    public getDesc(): CommandDesc | undefined {
        return DescProvider.getCommandDesc(this.val);
    }
}