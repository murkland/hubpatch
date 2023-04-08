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

export class Editor {
    dv: DataView;
    gameInfo: GameInfo;

    constructor(buffer: ArrayBuffer, gameInfo: GameInfo) {
        this.dv = new DataView(buffer);
        this.gameInfo = gameInfo;
    }

    static sramDumpToRaw(buffer: ArrayBuffer) {
        buffer = buffer.slice(SRAM_START_OFFSET, SRAM_START_OFFSET + SRAM_SIZE);
        maskSave(new DataView(buffer));
        return buffer;
    }

    static rawToSRAMDump(buffer: ArrayBuffer) {
        const arr = new Uint8Array(0x10000);
        arr.set(new Uint8Array(buffer), SRAM_START_OFFSET);
        maskSave(new DataView(arr.buffer, SRAM_START_OFFSET, SRAM_SIZE));
        return arr.buffer;
    }

    static sniff(buffer: ArrayBuffer) {
        if (buffer.byteLength != SRAM_SIZE) {
            throw (
                "invalid byte length of save file: expected " +
                SRAM_SIZE +
                " but got " +
                buffer.byteLength
            );
        }

        buffer = buffer.slice(0);

        const dv = new DataView(buffer);

        const decoder = new TextDecoder("ascii");
        const gn = decoder.decode(
            new Uint8Array(dv.buffer, dv.byteOffset + GAME_NAME_OFFSET, 20)
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
            getChecksum(dv) !=
            computeChecksum(dv, GAME_INFOS_BY_SAVE_GAME_NAME[gn].version)
        ) {
            throw "checksum mismatch";
        }

        return GAME_INFOS_BY_SAVE_GAME_NAME[gn];
    }

    computeChecksum() {
        return computeChecksum(this.dv, this.gameInfo.version);
    }

    rebuild() {
        this.rebuildChecksum();
    }

    toSRAMDump() {
        return Editor.rawToSRAMDump(this.dv.buffer);
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

    static PATCH_CARD_INFO = [
        { name: "", mb: 0 },
        { name: "Mettaur", mb: 7 },
        { name: "VolGear", mb: 12 },
        { name: "Ghost", mb: 15 },
        { name: "Swordy", mb: 10 },
        { name: "Fishy", mb: 18 },
        { name: "Piranha", mb: 10 },
        { name: "Ratty", mb: 10 },
        { name: "Billy", mb: 5 },
        { name: "Candela", mb: 9 },
        { name: "Anaconda", mb: 12 },
        { name: "Mushy", mb: 15 },
        { name: "Spikey", mb: 6 },
        { name: "Puffball", mb: 16 },
        { name: "Yort", mb: 17 },
        { name: "Dominerd", mb: 18 },
        { name: "Null", mb: 13 },
        { name: "BrushMan", mb: 19 },
        { name: "Scuttlst", mb: 20 },
        { name: "SnowBlow", mb: 17 },
        { name: "KillrEye", mb: 21 },
        { name: "Quaker", mb: 15 },
        { name: "Boomer", mb: 18 },
        { name: "Lark", mb: 17 },
        { name: "Moloko", mb: 5 },
        { name: "Melody", mb: 15 },
        { name: "Zomon", mb: 20 },
        { name: "Catack", mb: 20 },
        { name: "Champy", mb: 15 },
        { name: "Whirly", mb: 20 },
        { name: "Cactikil", mb: 16 },
        { name: "Roll", mb: 40 },
        { name: "GutsMan", mb: 35 },
        { name: "FireMan", mb: 43 },
        { name: "Bass", mb: 45 },
        { name: "QuickMan", mb: 38 },
        { name: "SnakeMan", mb: 40 },
        { name: "BubblMan", mb: 37 },
        { name: "FlameMan", mb: 45 },
        { name: "MetalMan", mb: 46 },
        { name: "ShadeMan", mb: 43 },
        { name: "SparkMan", mb: 43 },
        { name: "JunkMan", mb: 40 },
        { name: "GyroMan", mb: 45 },
        { name: "Meddy", mb: 45 },
        { name: "CosmoMan", mb: 44 },
        { name: "Chaud's Custom", mb: 35 },
        { name: "Mr.-Match's Custom", mb: 35 },
        { name: "Count-Zap's Custom", mb: 35 },
        { name: "Anetta's Custom", mb: 47 },
        { name: "Chillski's Custom", mb: 47 },
        { name: "Bugtank", mb: 7 },
        { name: "Powie", mb: 10 },
        { name: "Froshell", mb: 16 },
        { name: "HardHead", mb: 10 },
        { name: "Cloudy", mb: 10 },
        { name: "Gaia", mb: 15 },
        { name: "Popper", mb: 20 },
        { name: "Fan", mb: 15 },
        { name: "Drain", mb: 18 },
        { name: "Rush", mb: 11 },
        { name: "Bunny", mb: 8 },
        { name: "Flamey", mb: 20 },
        { name: "Shrimpy", mb: 10 },
        { name: "RedUFO", mb: 20 },
        { name: "Ninjoy", mb: 18 },
        { name: "Lavagon", mb: 20 },
        { name: "Protecto", mb: 23 },
        { name: "Basher", mb: 20 },
        { name: "Pengi", mb: 18 },
        { name: "Elebee", mb: 20 },
        { name: "AlphaBug", mb: 16 },
        { name: "N.O", mb: 13 },
        { name: "Eleball", mb: 14 },
        { name: "Dharma", mb: 22 },
        { name: "Weather", mb: 19 },
        { name: "Elmperor", mb: 20 },
        { name: "CirKill", mb: 18 },
        { name: "Drixol", mb: 17 },
        { name: "Batty", mb: 25 },
        { name: "Appley", mb: 24 },
        { name: "WoodMan", mb: 45 },
        { name: "ElecMan", mb: 35 },
        { name: "ProtoMan", mb: 45 },
        { name: "BombMan", mb: 43 },
        { name: "MagicMan", mb: 44 },
        { name: "HeatMan", mb: 45 },
        { name: "GateMan", mb: 46 },
        { name: "FlashMan", mb: 46 },
        { name: "DrillMan", mb: 47 },
        { name: "KingMan", mb: 45 },
        { name: "AquaMan", mb: 40 },
        { name: "WindMan", mb: 46 },
        { name: "LaserMan", mb: 47 },
        { name: "Colonel", mb: 42 },
        { name: "TmhkMan", mb: 40 },
        { name: "Lan's Custom", mb: 25 },
        { name: "Dex's Custom", mb: 40 },
        { name: "Maddy's Custom", mb: 5 },
        { name: "Yahoot's Bug Repair", mb: 17 },
        { name: "Tora's Tactics", mb: 64 },
        { name: "Life-Virus", mb: 55 },
        { name: "Gospel", mb: 60 },
        { name: "Serenade", mb: 50 },
        { name: "Alpha", mb: 55 },
        { name: "BassGS", mb: 59 },
        { name: "Duo", mb: 70 },
        { name: "BassXX", mb: 70 },
        { name: "Nebula-Gray", mb: 70 },
        { name: "Dad's Repair Program", mb: 50 },
        { name: "Hub Hikari", mb: 80 },
        { name: "Bass-Cross MegaMan", mb: 70 },
    ];

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
