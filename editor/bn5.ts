import type { Editor as EditorBase } from "./index";

interface GameInfo {
    region: "US" | "JP";
    version: "protoman" | "colonel";
}

const SRAM_START_OFFSET = 0x0100;
const SRAM_SIZE = 0x7c14;
const MASK_OFFSET = 0x1a34;
const GAME_NAME_OFFSET = 0x29e0;
const CHECKSUM_OFFSET = 0x29dc;

function maskSave(dv: DataView) {
    const mask = dv.getUint32(MASK_OFFSET, true);
    const unmasked = new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength);
    for (let i = 0; i < unmasked.length; ++i) {
        unmasked[i] = (unmasked[i] ^ mask) & 0xff;
    }
    // Write the mask back.
    dv.setUint32(MASK_OFFSET, mask, true);
}

function getChecksum(dv: DataView) {
    return dv.getUint32(CHECKSUM_OFFSET, true);
}

function computeChecksum(dv: DataView, version: string) {
    let checksum = CHECKSUM_START[version];
    const arr = new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength);
    for (let i = 0; i < arr.length; ++i) {
        if (i == CHECKSUM_OFFSET) {
            // Don't include the checksum itself in the checksum.
            i += 3;
            continue;
        }
        checksum += arr[i];
    }
    return checksum;
}

const CHECKSUM_START: { [key: string]: number } = {
    protoman: 0x72,
    colonel: 0x18,
};

const GAME_INFOS_BY_SAVE_GAME_NAME: { [key: string]: GameInfo } = {
    "REXE5TOB 20041006 US": {
        region: "US",
        version: "protoman",
    },
    "REXE5TOK 20041006 US": {
        region: "US",
        version: "colonel",
    },
    "REXE5TOB 20041104 JP": {
        region: "JP",
        version: "protoman",
    },
    "REXE5TOK 20041104 JP": {
        region: "JP",
        version: "colonel",
    },
};

const PATCH_CARD_INFOS = [
    { name: "", nameJa: "", mb: 0 },
    { name: "Mettaur", nameJa: "メットール", mb: 7 },
    { name: "VolGear", nameJa: "ボルケルギア", mb: 12 },
    { name: "Ghost", nameJa: "ゴースラー", mb: 15 },
    { name: "Swordy", nameJa: "スウォーディン", mb: 10 },
    { name: "Fishy", nameJa: "キオルシン", mb: 18 },
    { name: "Piranha", nameJa: "アーバルボーイ", mb: 10 },
    { name: "Ratty", nameJa: "チュートン", mb: 10 },
    { name: "Billy", nameJa: "ビリー", mb: 5 },
    { name: "Candela", nameJa: "キャンデービル", mb: 9 },
    { name: "Anaconda", nameJa: "ダイジャン", mb: 12 },
    { name: "Mushy", nameJa: "チャマッシュ", mb: 15 },
    { name: "Spikey", nameJa: "ガルー", mb: 6 },
    { name: "Puffball", nameJa: "バジリコ", mb: 16 },
    { name: "Yort", nameJa: "ヨーヨット", mb: 17 },
    { name: "Dominerd", nameJa: "カーズ", mb: 18 },
    { name: "Null", nameJa: "ヌール", mb: 13 },
    { name: "BrushMan", nameJa: "フデロー", mb: 19 },
    { name: "Scuttlst", nameJa: "ドリームビット", mb: 20 },
    { name: "SnowBlow", nameJa: "スーンハーク", mb: 17 },
    { name: "KillrEye", nameJa: "キラーズアイ", mb: 21 },
    { name: "Quaker", nameJa: "クエイカー", mb: 15 },
    { name: "Boomer", nameJa: "ラウンダ", mb: 18 },
    { name: "Lark", nameJa: "ゲイラーク", mb: 17 },
    { name: "Moloko", nameJa: "マルモコ", mb: 5 },
    { name: "Melody", nameJa: "プルメロ", mb: 15 },
    { name: "Zomon", nameJa: "ザエモン", mb: 20 },
    { name: "Catack", nameJa: "キャタック", mb: 20 },
    { name: "Champy", nameJa: "チャンプル", mb: 15 },
    { name: "Whirly", nameJa: "ウズリム", mb: 20 },
    { name: "Cactikil", nameJa: "サボテコロン", mb: 16 },
    { name: "Roll", nameJa: "ロール", mb: 40 },
    { name: "GutsMan", nameJa: "ガッツマン", mb: 35 },
    { name: "FireMan", nameJa: "ファイアマン", mb: 43 },
    { name: "Bass", nameJa: "フォルテ", mb: 45 },
    { name: "QuickMan", nameJa: "クイックマン", mb: 38 },
    { name: "SnakeMan", nameJa: "スネークマン", mb: 40 },
    { name: "BubblMan", nameJa: "バブルマン", mb: 37 },
    { name: "FlameMan", nameJa: "フレイムマン", mb: 45 },
    { name: "MetalMan", nameJa: "メタルマン", mb: 46 },
    { name: "ShadeMan", nameJa: "シェードマン", mb: 43 },
    { name: "SparkMan", nameJa: "スパークマン", mb: 43 },
    { name: "JunkMan", nameJa: "ジャンクマン", mb: 40 },
    { name: "GyroMan", nameJa: "ジャイロマン", mb: 45 },
    { name: "Meddy", nameJa: "メディ", mb: 45 },
    { name: "CosmoMan", nameJa: "コスモマン", mb: 44 },
    { name: "Chaud's Custom", nameJa: "炎山のカスタマイズ", mb: 35 },
    {
        name: "Mr. Match's Custom",
        nameJa: "ヒノケンのカスタマイズ",
        mb: 35,
    },
    {
        name: "Count Zap's Custom",
        nameJa: "エレキ伯爵のカスタマイズ",
        mb: 35,
    },
    { name: "Anetta's Custom", nameJa: "アネッタのカスタマイズ", mb: 47 },
    {
        name: "Chillski's Custom",
        nameJa: "コオリスキーのカスタマイズ",
        mb: 47,
    },
    { name: "Bugtank", nameJa: "カブタンク", mb: 7 },
    { name: "Powie", nameJa: "ポワルド", mb: 10 },
    { name: "Froshell", nameJa: "フロシェル", mb: 16 },
    { name: "HardHead", nameJa: "ハルドボルズ", mb: 10 },
    { name: "Cloudy", nameJa: "クモンペ", mb: 10 },
    { name: "Gaia", nameJa: "ガイアント", mb: 15 },
    { name: "Popper", nameJa: "ミノゴロモン", mb: 20 },
    { name: "Fan", nameJa: "ファンカー", mb: 15 },
    { name: "Drain", nameJa: "チクリート", mb: 18 },
    { name: "Rush", nameJa: "ラッシュ", mb: 11 },
    { name: "Bunny", nameJa: "ラビリー", mb: 8 },
    { name: "Flamey", nameJa: "フレイボー", mb: 20 },
    { name: "Shrimpy", nameJa: "エビロン", mb: 10 },
    { name: "RedUFO", nameJa: "UFOサニー", mb: 20 },
    { name: "Ninjoy", nameJa: "ゲニン", mb: 18 },
    { name: "Lavagon", nameJa: "マグマドラゴン", mb: 20 },
    { name: "Protecto", nameJa: "プロテクト", mb: 23 },
    { name: "Basher", nameJa: "ドゴーン", mb: 20 },
    { name: "Pengi", nameJa: "コリペン", mb: 18 },
    { name: "Elebee", nameJa: "スパークビー", mb: 20 },
    { name: "AlphaBug", nameJa: "プロトバグ", mb: 16 },
    { name: "N.O", nameJa: "N.O", mb: 13 },
    { name: "Eleball", nameJa: "パラボール", mb: 14 },
    { name: "Dharma", nameJa: "ダーマ", mb: 22 },
    { name: "Weather", nameJa: "ウェザース", mb: 19 },
    { name: "Elmperor", nameJa: "エレンプラ", mb: 20 },
    { name: "CirKill", nameJa: "サーキラー", mb: 18 },
    { name: "Drixol", nameJa: "ドリクロール", mb: 17 },
    { name: "Batty", nameJa: "パルスバット", mb: 25 },
    { name: "Appley", nameJa: "アップルサム", mb: 24 },
    { name: "WoodMan", nameJa: "ウッドマン", mb: 45 },
    { name: "ElecMan", nameJa: "エレキマン", mb: 35 },
    { name: "ProtoMan", nameJa: "ブルース", mb: 45 },
    { name: "BombMan", nameJa: "ボンバーマン", mb: 43 },
    { name: "MagicMan", nameJa: "マジックマン", mb: 44 },
    { name: "HeatMan", nameJa: "ヒートマン", mb: 45 },
    { name: "GateMan", nameJa: "ゲートマン", mb: 46 },
    { name: "FlashMan", nameJa: "フラッシュマン", mb: 46 },
    { name: "DrillMan", nameJa: "ドリルマン", mb: 47 },
    { name: "KingMan", nameJa: "キングマン", mb: 45 },
    { name: "AquaMan", nameJa: "アクアマン", mb: 40 },
    { name: "WindMan", nameJa: "ウインドマン", mb: 46 },
    { name: "LaserMan", nameJa: "レーザーマン", mb: 47 },
    { name: "Colonel", nameJa: "カーネル", mb: 42 },
    { name: "TmhkMan", nameJa: "トマホークマン", mb: 40 },
    { name: "Lan's Custom", nameJa: "熱斗のカスタマイズ", mb: 25 },
    { name: "Dex's Custom", nameJa: "デカオのカスタマイズ", mb: 40 },
    { name: "Maddy's Custom", nameJa: "まどいのカスタマイズ ", mb: 5 },
    {
        name: "Yahoot's Bug Repair",
        nameJa: "マハ･ジャラマのバグ修正",
        mb: 17,
    },
    { name: "Tora's Tactics", nameJa: "虎吉の戦術", mb: 64 },
    { name: "Life-Virus", nameJa: "ドリームウイルス", mb: 55 },
    { name: "Gospel", nameJa: "ゴスペル", mb: 60 },
    { name: "Serenade", nameJa: "セレナード", mb: 50 },
    { name: "Alpha", nameJa: "プロト", mb: 55 },
    { name: "BassGS", nameJa: "フォルテGS", mb: 59 },
    { name: "Duo", nameJa: "デューオ", mb: 70 },
    { name: "BassXX", nameJa: "フォルテXX", mb: 70 },
    { name: "Nebula-Gray", nameJa: "ネビュラグレイ", mb: 70 },
    {
        name: "Dad's Repair Program",
        nameJa: "パパの修正プログラム",
        mb: 50,
    },
    { name: "Hub Hikari", nameJa: "光 彩斗", mb: 80 },
    {
        name: "Bass-Cross MegaMan",
        nameJa: "フォルテクロスロックマン",
        mb: 70,
    },
];

export class Editor implements EditorBase {
    dv: DataView;
    gameInfo: GameInfo;

    static NAME = "bn5";

    constructor(buffer: ArrayBuffer) {
        buffer = buffer.slice(SRAM_START_OFFSET, SRAM_START_OFFSET + SRAM_SIZE);
        maskSave(new DataView(buffer));
        this.dv = new DataView(buffer);

        const decoder = new TextDecoder("ascii");
        const gn = decoder.decode(
            new Uint8Array(
                this.dv.buffer,
                this.dv.byteOffset + GAME_NAME_OFFSET,
                20
            )
        );
        if (
            !Object.prototype.hasOwnProperty.call(
                GAME_INFOS_BY_SAVE_GAME_NAME,
                gn
            )
        ) {
            throw "unknown game name: " + gn;
        }

        if (
            getChecksum(this.dv) !=
            computeChecksum(this.dv, GAME_INFOS_BY_SAVE_GAME_NAME[gn].version)
        ) {
            throw "checksum mismatch";
        }

        this.gameInfo = GAME_INFOS_BY_SAVE_GAME_NAME[gn];
    }

    computeChecksum() {
        return computeChecksum(this.dv, this.gameInfo.version);
    }

    rebuild() {
        this.rebuildChecksum();
    }

    export() {
        this.rebuild();
        const arr = new Uint8Array(0x10000);
        arr.set(new Uint8Array(this.dv.buffer), SRAM_START_OFFSET);
        maskSave(new DataView(arr.buffer, SRAM_START_OFFSET, SRAM_SIZE));
        return arr.buffer;
    }

    getChecksum() {
        return getChecksum(this.dv);
    }

    rebuildChecksum() {
        return this.dv.setUint32(CHECKSUM_OFFSET, this.computeChecksum(), true);
    }

    getPatchCardCount() {
        return this.dv.getUint8(0x79a0);
    }

    setPatchCardCount(n: number) {
        this.dv.setUint8(0x79a0, n);
    }

    getPatchCardInfos() {
        return PATCH_CARD_INFOS;
    }

    getPatchCard(i: number) {
        if (i >= this.getPatchCardCount()) {
            return null;
        }

        const c = this.dv.getUint8(0x79d0 + i);
        return {
            id: c & 0x7f,
            enabled: !(c >> 7),
        };
    }

    setPatchCard(i: number, id: number, enabled: boolean) {
        this.dv.setUint8(0x79d0 + i, id | ((enabled ? 0 : 1) << 7));
    }
}
