export interface DkEntity {
    val: string;
    doc?: string;
    [prop: string]: any;
    preselect?: boolean;
    noSuggest?: boolean;
}