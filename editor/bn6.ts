import type { Editor as EditorBase } from "./index";

const SRAM_START_OFFSET = 0x0100;
const SRAM_SIZE = 0x6710;
const MASK_OFFSET = 0x1064;
const GAME_NAME_OFFSET = 0x1c70;
const CHECKSUM_OFFSET = 0x1c6c;

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

function maskSave(dv: DataView) {
    const mask = dv.getUint32(MASK_OFFSET, true);
    const unmasked = new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength);
    for (let i = 0; i < unmasked.length; ++i) {
        // We only actually need to use the first byte of the mask, even though it's 32 bits long.
        unmasked[i] = (unmasked[i] ^ mask) & 0xff;
    }
    // Write the mask back.
    dv.setUint32(MASK_OFFSET, mask, true);
}

const PATCH_CARD_INFOS = [
    { name: "", nameJa: "", mb: 0 },
    { name: "Canodumb", nameJa: "キャノーダム", mb: 10 },
    { name: "Ammncule", nameJa: "アモナキュール", mb: 16 },
    { name: "ColdBear", nameJa: "コルドベア", mb: 18 },
    { name: "Miney", nameJa: "ジーラ", mb: 12 },
    { name: "Megalian", nameJa: "メガリア", mb: 20 },
    { name: "MettFire", nameJa: "メテファイア", mb: 20 },
    { name: "KilPlant", nameJa: "キルプラント", mb: 19 },
    { name: "Shadow", nameJa: "ダークシャドー", mb: 6 },
    { name: "Beetle", nameJa: "ボンビートル", mb: 11 },
    { name: "Heavy", nameJa: "ヘビーアレイ", mb: 15 },
    { name: "Viney", nameJa: "アゾマータ", mb: 24 },
    { name: "Slimey", nameJa: "ジェライム", mb: 12 },
    { name: "Volcano", nameJa: "ボルカノ", mb: 10 },
    { name: "Number", nameJa: "ナンバーズ", mb: 17 },
    { name: "MagTect", nameJa: "マグテクト", mb: 15 },
    { name: "Spidy", nameJa: "クーモス", mb: 8 },
    { name: "BomBoy", nameJa: "ボムボーイ", mb: 14 },
    { name: "WuNote", nameJa: "ウドノート", mb: 13 },
    { name: "Flashy", nameJa: "ピカラー", mb: 11 },
    { name: "Eleogre", nameJa: "エレオーガ", mb: 16 },
    { name: "OldStov", nameJa: "ダルスト", mb: 12 },
    { name: "Puffy (BN6)", nameJa: "センボン", mb: 11 },
    { name: "Starfish", nameJa: "ヒトデスタ", mb: 15 },
    { name: "BigHat", nameJa: "グラサン", mb: 8 },
    { name: "ScarCrow", nameJa: "カカジー", mb: 14 },
    { name: "FgtrPlne", nameJa: "ゼロプレーン", mb: 20 },
    { name: "Cragger", nameJa: "レムゴン", mb: 19 },
    { name: "Armadill", nameJa: "アルマン", mb: 12 },
    { name: "Kettle", nameJa: "ヤカーン", mb: 15 },
    { name: "ErthDrgn", nameJa: "ツボリュウ", mb: 20 },
    { name: "NumbrMan", nameJa: "ナンバーマン", mb: 35 },
    { name: "IceMan", nameJa: "アイスマン", mb: 25 },
    { name: "SkullMan", nameJa: "スカルマン", mb: 30 },
    { name: "ShadoMan", nameJa: "シャドーマン", mb: 38 },
    { name: "CutMan", nameJa: "カットマン", mb: 32 },
    { name: "KnigtMan", nameJa: "ナイトマン", mb: 45 },
    { name: "ToadMan", nameJa: "トードマン", mb: 34 },
    { name: "MagntMan", nameJa: "マグネットマン", mb: 37 },
    { name: "PlanetMn", nameJa: "プラネットマン", mb: 40 },
    { name: "BeastMan", nameJa: "ビーストマン", mb: 33 },
    { name: "DesertMn", nameJa: "デザートマン", mb: 36 },
    { name: "YamatoMn", nameJa: "ヤマトマン", mb: 35 },
    { name: "VideoMan", nameJa: "ビデオマン", mb: 32 },
    { name: "BurnrMan", nameJa: "バーナーマン", mb: 29 },
    { name: "StarMan", nameJa: "スターマン", mb: 32 },
    { name: "BlizMan", nameJa: "ブリザードマン", mb: 30 },
    { name: "LarkMan", nameJa: "スワローマン", mb: 36 },
    { name: "SlashMan", nameJa: "スラッシュマン", mb: 31 },
    { name: "EraseMan", nameJa: "キラーマン", mb: 40 },
    { name: "GrndMan", nameJa: "グランドマン", mb: 43 },
    { name: "DustMan", nameJa: "ダストマン", mb: 37 },
    { name: "BlastMan", nameJa: "ブラストマン", mb: 28 },
    { name: "CrcusMan", nameJa: "サーカスマン", mb: 43 },
    { name: "Handy", nameJa: "ハンディース", mb: 16 },
    { name: "Puffy (BN1)", nameJa: "プクール", mb: 12 },
    { name: "Jelly", nameJa: "ジェリー", mb: 13 },
    { name: "Poitton", nameJa: "ポイットン", mb: 13 },
    { name: "Satella", nameJa: "サテラ", mb: 8 },
    { name: "Twisty", nameJa: "パララ＆リモコゴロー", mb: 9 },
    { name: "Sparky", nameJa: "ユラ", mb: 8 },
    { name: "Octon", nameJa: "タコバル", mb: 14 },
    { name: "ShelGeek", nameJa: "シェルキー", mb: 8 },
    { name: "Magneakr", nameJa: "マグニッカー", mb: 7 },
    { name: "Metrid", nameJa: "メテマージ", mb: 15 },
    { name: "Momogra", nameJa: "モモグラン", mb: 6 },
    { name: "Needler", nameJa: "ニドキャスター", mb: 10 },
    { name: "Twins", nameJa: "ツインズ", mb: 15 },
    { name: "Walla", nameJa: "ウォーラ", mb: 12 },
    { name: "Kilby", nameJa: "キルブー", mb: 24 },
    { name: "Totem", nameJa: "トトポール", mb: 13 },
    { name: "CanGuard", nameJa: "キャノガード", mb: 10 },
    { name: "Skarab", nameJa: "スカラビア", mb: 7 },
    { name: "Draggin", nameJa: "ドラグリン", mb: 11 },
    { name: "Marina", nameJa: "マリーナ", mb: 14 },
    { name: "HntdCndl", nameJa: "ドルダーラ", mb: 12 },
    { name: "Gunner", nameJa: "ガンナー", mb: 11 },
    { name: "PulsBulb", nameJa: "パルフォロン", mb: 13 },
    { name: "BombCorn", nameJa: "ボムコーン", mb: 16 },
    { name: "Shrubby", nameJa: "モリキュー", mb: 6 },
    { name: "HonyBomr", nameJa: "ハニホー", mb: 12 },
    { name: "NghtMare", nameJa: "ナイトメア", mb: 5 },
    { name: "SnakeArm", nameJa: "スナーム", mb: 11 },
    { name: "DarkMech", nameJa: "アサシンメカ", mb: 22 },
    { name: "StoneMan", nameJa: "ストーンマン", mb: 45 },
    { name: "ColorMan", nameJa: "カラードマン", mb: 32 },
    { name: "SharkMan", nameJa: "シャークマン", mb: 35 },
    { name: "PharoMan", nameJa: "ファラオマン", mb: 35 },
    { name: "AirMan", nameJa: "エアーマン", mb: 34 },
    { name: "FreezeMn", nameJa: "フリーズマン", mb: 30 },
    { name: "ThunMan", nameJa: "サンダーマン", mb: 36 },
    { name: "NapalmMn", nameJa: "ナパームマン", mb: 39 },
    { name: "PlantMan", nameJa: "プラントマン", mb: 42 },
    { name: "MistMan", nameJa: "ミストマン", mb: 37 },
    { name: "BowlMan", nameJa: "ボウルマン", mb: 30 },
    { name: "DarkMan", nameJa: "ダークマン", mb: 25 },
    { name: "TopMan", nameJa: "タップマン", mb: 28 },
    { name: "KendoMan", nameJa: "ケンドーマン", mb: 38 },
    { name: "ColdMan", nameJa: "コールドマン", mb: 34 },
    { name: "SearchMn", nameJa: "サーチマン", mb: 37 },
    { name: "CloudMan", nameJa: "クラウドマン", mb: 40 },
    { name: "GridMan", nameJa: "フットマン", mb: 48 },
    { name: "ChrgeMan", nameJa: "チャージマン", mb: 31 },
    { name: "TenguMan", nameJa: "テングマン", mb: 34 },
    { name: "DiveMan", nameJa: "ダイブマン", mb: 42 },
    { name: "JudgeMan", nameJa: "ジャッジマン", mb: 38 },
    { name: "ElmntMan", nameJa: "エレメントマン", mb: 33 },
    { name: "Punk", nameJa: "パンク", mb: 50 },
    { name: "DarkMega", nameJa: "ダークロックマン", mb: 80 },
    { name: "SoulCust", nameJa: "ソウルバトラーのカスタマイズ", mb: 66 },
    { name: "MrFamous", nameJa: "名人の超絶カスタマイズ", mb: 69 },
    { name: "BassBX", nameJa: "フォルテＢＸ", mb: 70 },
    { name: "Django", nameJa: "ジャンゴ", mb: 52 },
    { name: "Count", nameJa: "伯爵", mb: 60 },
    { name: "MM-Zero", nameJa: "ロックマンゼロ", mb: 45 },
    { name: "Gregar", nameJa: "電脳獣グレイガ", mb: 70 },
    { name: "Falzar", nameJa: "電脳獣ファルザー", mb: 70 },
    { name: "BassCrss", nameJa: "フォルテクロスロックマン", mb: 70 },
];

const CHECKSUM_START: { [key: string]: number } = {
    falzar: 0x18,
    gregar: 0x72,
};

const VERSION_BY_SAVE_GAME_NAME: { [key: string]: string } = {
    "REXE6 F 20050924a JP": "falzar",
    "REXE6 G 20050924a JP": "gregar",
};

export class Editor implements EditorBase {
    dv: DataView;
    version: string;

    static NAME = "bn6";

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
            !Object.prototype.hasOwnProperty.call(VERSION_BY_SAVE_GAME_NAME, gn)
        ) {
            throw "unknown game name: " + gn;
        }

        if (
            getChecksum(this.dv) !=
            computeChecksum(this.dv, VERSION_BY_SAVE_GAME_NAME[gn])
        ) {
            throw "checksum mismatch";
        }

        this.version = VERSION_BY_SAVE_GAME_NAME[gn];
    }

    computeChecksum() {
        return computeChecksum(this.dv, this.version);
    }

    rebuild() {
        this.rebuildPatchCardsLoaded();
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

    rebuildPatchCardsLoaded() {
        for (let i = 1; i < 118; ++i) {
            this.setPatchCardLoaded(i, false);
        }
        for (let i = 0; i < this.getPatchCardCount(); ++i) {
            this.setPatchCardLoaded(this.getPatchCard(i)!.id, true);
        }
    }

    rebuildChecksum() {
        return this.dv.setUint32(CHECKSUM_OFFSET, this.computeChecksum(), true);
    }

    getPatchCardCount() {
        return this.dv.getUint8(0x65f0);
    }

    setPatchCardCount(n: number) {
        this.dv.setUint8(0x65f0, n);
    }

    getPatchCardInfos() {
        return PATCH_CARD_INFOS;
    }

    getPatchCard(i: number) {
        if (i >= this.getPatchCardCount()) {
            return null;
        }

        const c = this.dv.getUint8(0x6620 + i);
        return {
            id: c & 0x7f,
            enabled: !(c >> 7),
        };
    }

    setPatchCard(i: number, id: number, enabled: boolean) {
        this.dv.setUint8(0x6620 + i, id | ((enabled ? 0 : 1) << 7));
    }

    setPatchCardLoaded(id: number, loaded: boolean) {
        this.dv.setUint8(
            0x5047 + id,
            this.dv.getUint8(0x06bf + id) ^
                (loaded
                    ? {
                          falzar: 0x8d,
                          gregar: 0x43,
                      }[this.version]
                    : 0xff)
        );
    }
}
