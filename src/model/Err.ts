import { ErrMsg } from "./ErrMsg";

export interface Err {
    msg: ErrMsg | string;
    start?: number;
    end?: number;
}