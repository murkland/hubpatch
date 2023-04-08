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
    getPatchCard(i: number): { id: number; enabled: boolean };
    setPatchCard(i: number, id: number, enabled: boolean);
}
