import { Entities } from "../Entities";
import { MappersDk } from "../MappersDk";
import { TypeTools } from "../TypeTools";
import { Utils } from "../Utils";
import { DkEntity } from "./DkEntity";
import { DkSuggestion } from "./DkSuggestion";
import { ParamType } from "./ParamType";

export enum CustomDocType {
    FLAG = "F",
    CAMPAIGN_FLAG = "CF",
    TIMER = "T",
    AP = "AP",
    HERO_GATE = "HG"
}

const PLAYER_ABBREVS: Record<string, string> = {
    "P0": "PLAYER0",
    "P1": "PLAYER1",
    "P2": "PLAYER2",
    "P3": "PLAYER3",
    "PG": "PLAYER_GOOD",
    "PA": "ALL_PLAYERS",
};

const REGEXP_PARTS = {
    players: Entities.findPlayersForVars().map(e => e.val).concat(Object.keys(PLAYER_ABBREVS)).join("|"),
    flags: Entities.findAllFlags().map(e => e.val).join("|"),
    campaignFlags: Entities.findAllCampaignFlags().map(e => e.val).join("|"),
    timers: Entities.findAllTimers().map(e => e.val).join("|"),
    indices: [0, 1, 2, 3, 4, 5, 6, 7].join("|"),
};

const DOC_CONTEXT_REGEXPS: { [key: CustomDocType | string]: RegExp } = {
    [CustomDocType.FLAG]: new RegExp(`(${REGEXP_PARTS.players})(\\s*[,.]\\s*)(${REGEXP_PARTS.flags}|${REGEXP_PARTS.indices})([\\s-=:]*)(.*)`, "i"),
    [CustomDocType.CAMPAIGN_FLAG]: new RegExp(`(${REGEXP_PARTS.players})(\\s*[,.]\\s*)(${REGEXP_PARTS.campaignFlags}|${REGEXP_PARTS.indices})([\\s-=:]*)(.*)`, "i"),
    [CustomDocType.TIMER]: new RegExp(`(${REGEXP_PARTS.players})(\\s*[,.]\\s*)(${REGEXP_PARTS.timers}|${REGEXP_PARTS.indices})([\\s-=:]*)(.*)`, "i"),
    [CustomDocType.AP]: /(action\spoint\s*)?(\d+)(\s?[-~,;:]\s?\d+)?([\s-=:]*)(.*)/i,
    [CustomDocType.HERO_GATE]: /(hero\sgate\s*)?(-?\d+)(\s?[-~,;:]\s?-?\d+)?([\s-=:]*)(.*)/i,
};

const INDEXED_VAR_NAMES: { [key: CustomDocType | string]: string } = {
    [CustomDocType.FLAG]: "FLAG",
    [CustomDocType.CAMPAIGN_FLAG]: "CAMPAIGN_FLAG",
    [CustomDocType.TIMER]: "TIMER",
};

const DOC_START_DETECTION = {
    campaignFlags: {
        re: /campaign\sflags( \w*)?:/i,
        type: CustomDocType.CAMPAIGN_FLAG,
    },
    flags: {
        re: /flags( \w*)?:/i,
        type: CustomDocType.FLAG,
    },
    timers: {
        re: /timers( \w*)?:/i,
        type: CustomDocType.TIMER,
    },
    aps: {
        re: /action\spoints:|aps:/i,
        type: CustomDocType.AP,
    },
    heroGates: {
        re: /(hero\s*)?gates:/i,
        type: CustomDocType.HERO_GATE,
    },
};

const PAIR_VAR_SEP = ",";

interface DocContext {
    start: number;
    last: number;
    type: CustomDocType;
}

export interface CustomDocResult {
    key: string;
    doc: string;
    type: CustomDocType;
    keyName: string;
    rawPlayerName?: string;
}

export class CustomDoc {
    private context: DocContext | undefined;
    private docsForPairVars: { [key: string]: CustomDocResult } = {};
    private docsForAps: { [key: string]: CustomDocResult } = {};
    private docsForHeroGates: { [key: string]: CustomDocResult } = {};

    public processComment(comment: string, row: number): void {
        // detect doc start
        const customDocTypeStart: CustomDocType | undefined = Object.values(DOC_START_DETECTION).find(d => d.re.test(comment))?.type;
        if (customDocTypeStart != null) {
            this.context = {
                start: row,
                last: row,
                type: customDocTypeStart,
            };
        }
        this.tryDocPush(comment, row);
    }

    public getCustomDoc(type: ParamType, varName: string, playerName = ""): CustomDocResult | null {
        if (type === ParamType.ActionPoint) {
            return this.docsForAps[varName] || null;
        } else if (type === ParamType.HeroGate) {
            return this.docsForHeroGates[varName] || null;
        }
        return this.docsForPairVars[`${TypeTools.playerColorToIndexedPlayer(playerName).toUpperCase()}${PAIR_VAR_SEP}${varName.toUpperCase()}`] || null;
    }

    public suggestCustomDoc(type: ParamType, playerName = ""): DkSuggestion[] {
        if (type === ParamType.ActionPoint || type === ParamType.HeroGate) {
            const pseudoEntities: DkEntity[] = Object.entries(type === ParamType.ActionPoint ? this.docsForAps : this.docsForHeroGates)
                .map(([key, doc]) => ({
                    val: key,
                    doc: doc.doc
                }));
            return pseudoEntities.map(e => MappersDk.entityToDkSuggestion(e));
        }
        if ([ParamType.Flag, ParamType.CampaignFlag, ParamType.Timer].includes(type)) {
            playerName = TypeTools.playerColorToIndexedPlayer(playerName);

            const consideredKeys: string[] = Object.keys(this.docsForPairVars).map(key => {
                const stringKey = key + "";
                const [playerKeyName, varKeyName] = stringKey.split(PAIR_VAR_SEP);
                if (Utils.compare(playerKeyName, playerName) && varKeyName.startsWith(type)) {
                    return stringKey;
                }
                return "";
            }).filter(Boolean);

            const pseudoEntities: DkEntity[] = [];
            for (const key of consideredKeys) {
                pseudoEntities.push({
                    val: key.split(PAIR_VAR_SEP)[1],
                    doc: this.docsForPairVars[key].doc,
                });
            }
            return pseudoEntities.map(e => MappersDk.entityToDkSuggestion(e));
        }
        return [];
    }

    private static playerAbbrevToPlayerName(abbrev: string): string {
        if (abbrev.length === 2) {
            return PLAYER_ABBREVS[abbrev.toUpperCase()] || abbrev;
        }
        return abbrev;
    }

    private tryDocPush(comment: string, row: number) {
        if (this.context == null || this.context.last !== row - 1) {
            return;
        }

        if ([CustomDocType.FLAG, CustomDocType.CAMPAIGN_FLAG, CustomDocType.TIMER].includes(this.context.type)) {
            const regCheck = DOC_CONTEXT_REGEXPS[this.context.type].exec(comment);
            if (regCheck?.length === 6) {
                const unabbrevPlayer = CustomDoc.playerAbbrevToPlayerName(regCheck[1]);
                const playerVar = TypeTools.playerColorToIndexedPlayer(unabbrevPlayer);
                const flagVar = /^\d+/.test(regCheck[3])
                    ? (INDEXED_VAR_NAMES[this.context.type] + regCheck[3])
                    : regCheck[3];
                const doc = regCheck[5];
                const key = `${playerVar.toUpperCase()}${PAIR_VAR_SEP}${flagVar.toUpperCase()}`;
                this.docsForPairVars[key] ||= {
                    doc,
                    key,
                    keyName: `${unabbrevPlayer}${PAIR_VAR_SEP}${flagVar}`,
                    type: this.context.type,
                    rawPlayerName: unabbrevPlayer,
                };
                this.context.last++;
            }
        }

        if ([CustomDocType.AP, CustomDocType.HERO_GATE].includes(this.context.type)) {
            const regCheck = DOC_CONTEXT_REGEXPS[this.context.type].exec(comment);
            if (regCheck?.length === 6) {
                const numberA: number = Math.abs(+regCheck[2]);
                const numberB: number = Math.abs(regCheck[3] ? +(regCheck[3].trim().substring(1)) : NaN);
                const upperLimit = isNaN(numberB) ? numberA : numberB;
                for (let i = numberA; i <= upperLimit; i++) {
                    if (this.context.type === CustomDocType.AP) {
                        this.docsForAps[i] ||= {
                            doc: regCheck[5],
                            key: "" + i,
                            keyName: "Action point " + i,
                            type: this.context.type,
                        };
                    } else {
                        this.docsForHeroGates[-i] ||= {
                            doc: regCheck[5],
                            key: "" + i,
                            keyName: "Hero gate " + i,
                            type: this.context.type,
                        };
                    }

                }
                this.context.last++;
            }
        }
    }
}