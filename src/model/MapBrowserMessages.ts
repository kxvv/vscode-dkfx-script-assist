export enum MBMType {
    Build = "build",
}

export interface MBMMap {
    name: string;
    path: string;
    title: string;
}

export interface MBMInitial {
    type: MBMType;
    maps: MBMMap[];
}