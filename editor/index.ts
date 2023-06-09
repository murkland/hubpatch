interface PatchCardInfo {
    name: string;
    nameJa: string;
    mb: number;
}

export interface Editor {
    export(): ArrayBuffer;
    getPatchCardInfos(): PatchCardInfo[];
    getPatchCardCount(): number;
    setPatchCardCount(n: number);
    getPatchCard(i: number): { id: number; enabled: boolean } | null;
    setPatchCard(i: number, id: number, enabled: boolean);
}

export interface EditorConstructor {
    new (buf: ArrayBuffer): Editor;
    NAME: string;
}
