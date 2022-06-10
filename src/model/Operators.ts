export enum Operator {
    Lt = "<",
    Gt = ">",
    Lte = "<=",
    Gte = ">=",
    Eq = "==",
    Neq = "!=",
    Rng = "~",
}

export const OPERATORS: Readonly<Operator[]> = [
    Operator.Lt,
    Operator.Gt,
    Operator.Lte,
    Operator.Gte,
    Operator.Eq,
    Operator.Neq,
    Operator.Rng,
];
