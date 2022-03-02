import { AVAIL_COMPARISON_PARAMS, COMPARISON_PARAMS, CONTROL_COMPARISON_PARAMS } from "./DescProvider";
import { DK_ENTITIES } from "./Entities";
import { ErrMsgUtils } from "./ErrMsgUtils";
import { MappersDk } from "./MappersDk";
import { DkSuggestion } from "./model/DkSuggestion";
import { ErrMsg } from "./model/ErrMsg";
import { ErrSeverity } from "./model/ErrSeverity";
import { Operators } from "./model/Operators";
import { OperatorType } from "./model/OperatorType";
import { ParamDiagProps } from "./model/ParamDiagProps";
import { ParamType } from "./model/ParamType";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { SuggestionKind } from "./model/SuggestionKind";
import { Utils } from "./Utils";

export const CONSTRAINTS = {
    minMsgNumber: 0,
    maxMsgNumber: 50,
    maxByte: 255,
    minAp: 0, // action point
    maxAp: 48,
    minHg: -48, // hero gate
    maxHg: -1,
    minSlab: 0,
    maxSlab: 85,
    minSubtile: 0,
    maxSubtile: 254,
    maxTextLen: 1024,
};

const CUSTOM_ENTITY_PREFIX = "CUSTOM_";

interface TypeProps {
    entities: string[];
    suggest(state: ScriptAnalysis): DkSuggestion[],
    check(props: ParamDiagProps): boolean;
}

export const OPERATOR_TYPES: { [key: string | Operators]: OperatorType } = {
    [Operators.Eq]: OperatorType.Relational,
    [Operators.Neq]: OperatorType.Relational,
    [Operators.Lt]: OperatorType.Relational,
    [Operators.Lte]: OperatorType.Relational,
    [Operators.Gt]: OperatorType.Relational,
    [Operators.Gte]: OperatorType.Relational,
    [Operators.Rng]: OperatorType.Arithmetic,
};

export const DK_TYPES: { [key: string]: TypeProps } = {
    [ParamType.Gold]: {
        entities: ["100", "500", "1000", "5000", "15000"],
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(this.entities, this.entities[0]);
        }
    },
    [ParamType.Player]: {
        entities: DK_ENTITIES[ParamType.Player].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Player].map(e => MappersDk.entityToDkSuggestion(e, "PLAYER0"));
        }
    },
    [ParamType.PlayerGood]: {
        entities: DK_ENTITIES[ParamType.PlayerGood].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.PlayerGood].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.SlabType]: {
        entities: DK_ENTITIES[ParamType.SlabType].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.SlabType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Keeper]: {
        entities: DK_ENTITIES[ParamType.Player].filter(e => e.keeper).map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(this.entities, this.entities[0]);
        }
    },
    [ParamType.Object]: {
        entities: DK_ENTITIES[ParamType.Object].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Object].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CreatureConfig]: {
        entities: DK_ENTITIES[ParamType.CreatureConfig].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CreatureConfig].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.ResearchType]: {
        entities: DK_ENTITIES[ParamType.ResearchType].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(this.entities, this.entities[0]);
        }
    },
    [ParamType.Version]: {
        entities: ["1"],
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(this.entities, this.entities[0]);
        }
    },
    [ParamType.MsgNumber]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            // + 1 because 0 is valid but not often desired
            for (let i = CONSTRAINTS.minMsgNumber + 1; i <= CONSTRAINTS.maxMsgNumber; i++) {
                if (!state.msgSlots[i]) { return suggestEntities([String(i)], String(i)); }
            }
            return suggestEntities([]); // TODO
        }
    },
    [ParamType.Timer]: {
        entities: DK_ENTITIES[ParamType.Timer].map(t => t.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Timer].map(e => MappersDk.entityToDkSuggestion(e, "TIMER0"));
        }
    },
    [ParamType.Flag]: {
        entities: DK_ENTITIES[ParamType.Flag].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Flag].map(e => MappersDk.entityToDkSuggestion(e, "FLAG0"));
        }
    },
    [ParamType.Room]: {
        entities: DK_ENTITIES[ParamType.Room].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Room].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.RoomAvailability]: {
        entities: DK_ENTITIES[ParamType.RoomAvailability].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.RoomAvailability].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Power]: {
        entities: DK_ENTITIES[ParamType.Power].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Power].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Lvl]: {
        entities: DK_ENTITIES[ParamType.Lvl].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Lvl].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Button]: {
        entities: DK_ENTITIES[ParamType.Button].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Button].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.AnyCreature]: {
        entities: DK_ENTITIES[ParamType.AnyCreature].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.AnyCreature].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Binary]: {
        entities: DK_ENTITIES[ParamType.Binary].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Binary].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Zero]: {
        entities: DK_ENTITIES[ParamType.Zero].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Zero].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.KeeperIndex]: {
        entities: DK_ENTITIES[ParamType.KeeperIndex].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.KeeperIndex].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Door]: {
        entities: DK_ENTITIES[ParamType.Door].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase()) || pdp.arg.value.startsWith(CUSTOM_ENTITY_PREFIX);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Door].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Trap]: {
        entities: DK_ENTITIES[ParamType.Trap].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase()) || pdp.arg.value.startsWith(CUSTOM_ENTITY_PREFIX);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Trap].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CampaignFlag]: {
        entities: DK_ENTITIES[ParamType.CampaignFlag].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CampaignFlag].map(e => MappersDk.entityToDkSuggestion(e, "CAMPAIGN_FLAG0"));
        }
    },
    [ParamType.Byte]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value) && Math.abs(parseInt(pdp.arg.value)) <= CONSTRAINTS.maxByte;
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.Rule]: {
        entities: generateNumbered("RULE", 8),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(this.entities, this.entities[0]);
        }
    },
    [ParamType.Text]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return /^".*"$/i.test(pdp.arg.value) && (pdp.arg.value.length - 2) <= CONSTRAINTS.maxTextLen;
        },
        suggest(state: ScriptAnalysis) {
            return [MappersDk.entityToDkSuggestion({ val: `""` }, "", SuggestionKind.Text)];
        }
    },
    [ParamType.Number]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return /^-?\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities([]);
        }
    },
    [ParamType.NonNegNumber]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities([]);
        }
    },
    [ParamType.Party]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return pdp.state.parties.some(p => p.name === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(state.parties.map(p => p.name));
        }
    },
    [ParamType.NewParty]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return /^\D[_a-zA-Z\d]*$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.Comparison]: {
        entities: [
            Operators.Eq, Operators.Neq, Operators.Gt,
            Operators.Gte, Operators.Lt, Operators.Lte,
        ],
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return COMPARISON_PARAMS[0].allowedTypes.map(at => DK_TYPES[at].suggest(state)).flat();
        }
    },
    [ParamType.AvailabilityComparison]: {
        entities: [
            Operators.Eq, Operators.Neq, Operators.Gt,
            Operators.Gte, Operators.Lt, Operators.Lte,
        ],
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return AVAIL_COMPARISON_PARAMS[0].allowedTypes.map(at => DK_TYPES[at].suggest(state)).flat();
        }
    },
    [ParamType.ControlComparison]: {
        entities: [
            Operators.Eq, Operators.Neq, Operators.Gt,
            Operators.Gte, Operators.Lt, Operators.Lte,
        ],
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return CONTROL_COMPARISON_PARAMS[0].allowedTypes.map(at => DK_TYPES[at].suggest(state)).flat();
        }
    },
    [ParamType.ActionPoint]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            if (pdp.arg.value === Operators.Rng && !pdp.state.diags.some(d => d.msg === ErrMsg.TypeRangeNonConsecutive)) {
                pdp.state.diags.push({
                    start: pdp.arg.start,
                    end: pdp.arg.end,
                    line: pdp.line,
                    msg: ErrMsg.TypeRangeNonConsecutive,
                    severity: ErrSeverity.Error
                });
                return true;
            }
            return /^\d+$/.test(pdp.arg.value) && Utils.isBetween(parseInt(pdp.arg.value), CONSTRAINTS.minAp, CONSTRAINTS.maxAp);
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.HeroGate]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            if (pdp.arg.value === Operators.Rng && !pdp.state.diags.some(d => d.msg === ErrMsg.TypeRangeNonConsecutive)) {
                pdp.state.diags.push({
                    start: pdp.arg.start,
                    end: pdp.arg.end,
                    line: pdp.line,
                    msg: ErrMsg.TypeRangeNonConsecutive,
                    severity: ErrSeverity.Error
                });
                return true;
            }
            return /^-\d+$/.test(pdp.arg.value) && Utils.isBetween(parseInt(pdp.arg.value), CONSTRAINTS.minHg, CONSTRAINTS.maxHg);
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.Time]: {
        entities: ["150", "300", "450", "600", "900", "1200", "2400", "3600", "12000"],
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return this.entities.map(e => MappersDk.entityToDkSuggestion({ val: e}, "", SuggestionKind.Value));
        }
    },
    [ParamType.Computer]: {
        entities: DK_ENTITIES[ParamType.Computer].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Computer].map(e => MappersDk.entityToDkSuggestion(e, "0"));
        }
    },
    [ParamType.Operation]: {
        entities: DK_ENTITIES[ParamType.Operation].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Operation].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CompProcess]: {
        entities: DK_ENTITIES[ParamType.CompProcess].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CompProcess].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CompCheck]: {
        entities: DK_ENTITIES[ParamType.CompCheck].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CompCheck].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CompEvent]: {
        entities: DK_ENTITIES[ParamType.CompEvent].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CompEvent].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CompGlobal]: {
        entities: DK_ENTITIES[ParamType.CompGlobal].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CompGlobal].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CustomBox]: {
        entities: DK_ENTITIES[ParamType.CustomBox].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CustomBox]
                .slice(0, 5) // suggest just the first five
                .map(e => MappersDk.entityToDkSuggestion(e, "", SuggestionKind.Value));
        }
    },
    [ParamType.Objective]: {
        entities: DK_ENTITIES[ParamType.Objective].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Objective].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Lvl]: {
        entities: DK_ENTITIES[ParamType.Lvl].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Lvl].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CreatureProperty]: {
        entities: DK_ENTITIES[ParamType.CreatureProperty].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CreatureProperty].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CreatureTendency]: {
        entities: DK_ENTITIES[ParamType.CreatureTendency].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CreatureTendency].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.DoorConfig]: {
        entities: DK_ENTITIES[ParamType.DoorConfig].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.DoorConfig].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.ObjectConfig]: {
        entities: DK_ENTITIES[ParamType.ObjectConfig].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.ObjectConfig].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.TrapConfig]: {
        entities: DK_ENTITIES[ParamType.TrapConfig].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.TrapConfig].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.SacrificeCmd]: {
        entities: DK_ENTITIES[ParamType.SacrificeCmd].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.SacrificeCmd].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.PowerLvl]: {
        entities: DK_ENTITIES[ParamType.PowerLvl].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.PowerLvl].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Spell]: {
        entities: DK_ENTITIES[ParamType.Spell].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Spell].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.GameRule]: {
        entities: DK_ENTITIES[ParamType.GameRule].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.GameRule].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.TrapTriggerType]: {
        entities: DK_ENTITIES[ParamType.TrapTriggerType].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.TrapTriggerType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.TrapActivationType]: {
        entities: DK_ENTITIES[ParamType.TrapActivationType].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.TrapActivationType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Criterion]: {
        entities: DK_ENTITIES[ParamType.Criterion].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Criterion].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.AudioType]: {
        entities: DK_ENTITIES[ParamType.AudioType].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.AudioType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Subtile]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value)
                && Utils.isBetween(parseInt(pdp.arg.value), CONSTRAINTS.minSubtile, CONSTRAINTS.maxSubtile);
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.Slab]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value)
                && Utils.isBetween(parseInt(pdp.arg.value), CONSTRAINTS.minSlab, CONSTRAINTS.maxSlab);
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.HeadFor]: {
        entities: DK_ENTITIES[ParamType.HeadFor].map(e => e.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.HeadFor].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Creature]: {
        entities: DK_ENTITIES[ParamType.Creature].map(c => c.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Creature].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Global]: {
        entities: DK_ENTITIES[ParamType.Global].map(c => c.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Global].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CreatureGlobal]: {
        entities: DK_ENTITIES[ParamType.Global].filter(e => e.creature).map(c => c.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Global].filter(e => e.creature).map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.DisplayVarTargetType]: {
        entities: DK_ENTITIES[ParamType.DisplayVarTargetType].map(c => c.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.DisplayVarTargetType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.FillType]: {
        entities: DK_ENTITIES[ParamType.FillType].map(c => c.val),
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.FillType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Range]: {
        entities: [
            Operators.Rng,
        ],
        check(pdp: ParamDiagProps) {
            return this.entities.includes(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities([]);
        }
    },
    [ParamType.Unknown]: {
        entities: [],
        check(pdp: ParamDiagProps) {
            return true;
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
};

function generateNumbered(txt: string, count: number, start = 0) {
    return new Array(count).fill(0).map((e, i) => `${txt}${start + i}`);
}

function suggestEntities(labels: string[], preselectedLabel?: string): DkSuggestion[] {
    const mappingSuggestionProto: DkSuggestion = {
        label: "",
        kind: 19 // enum
    };
    return labels.map(label => ({
        ...mappingSuggestionProto,
        preselect: label === preselectedLabel,
        label
    }));
};

export class TypeUtils {
    static typeCheckParam(pdp: ParamDiagProps) {
        const allowedTypes = pdp.parentDesc.params[pdp.argIndex].allowedTypes;
        let checker;

        for (const at of allowedTypes) {
            checker = DK_TYPES[at];
            if (pdp.argDesc?.returns?.includes(at) || (checker && DK_TYPES[at].check(pdp))) {
                return;
            }
        }
        pdp.state.diags.push({
            start: pdp.arg.start,
            end: pdp.arg.end,
            line: pdp.line,
            severity: ErrSeverity.Error,
            msg: ErrMsgUtils.getTypeMismatchMsg(allowedTypes, pdp.arg.value)
        });
    }

    static suggestForType(state: ScriptAnalysis, type: ParamType): DkSuggestion[] {
        return DK_TYPES[type].suggest(state);
    }

    static playerColorToIndexedPlayer(value: string): string {
        switch (value.toUpperCase()) {
            case "RED":
                return "PLAYER0";
            case "BLUE":
                return "PLAYER1";
            case "GREEN":
                return "PLAYER2";
            case "YELLOW":
                return "PLAYER3";
            case "WHITE":
                return "PLAYER_GOOD";
        }
        return value;
    }
}
