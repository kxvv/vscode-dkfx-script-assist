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
    maxSubtile: 255,
    maxTextLen: 1024,
};

const CUSTOM_ENTITY_PREFIX = "CUSTOM_";

interface TypeProps {
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
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(["100", "500", "1000", "5000", "15000"]);
        }
    },
    [ParamType.Player]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Player].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Player].map(e => MappersDk.entityToDkSuggestion(e, "PLAYER0"));
        }
    },
    [ParamType.PlayerGood]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.PlayerGood].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.PlayerGood].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.SlabType]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.SlabType].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.SlabType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Keeper]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Player].filter(e => e.keeper).map(e => e.val)
                .includes(pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(DK_ENTITIES[ParamType.Player].filter(e => e.keeper).map(e => e.val), "PLAYER0");
        }
    },
    [ParamType.Object]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Object].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Object].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CreatureConfig]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CreatureConfig].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CreatureConfig].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.ResearchType]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.ResearchType].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.ResearchType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Version]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Version].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Version].map(e => MappersDk.entityToDkSuggestion(e), "1");
        }
    },
    [ParamType.MsgNumber]: {
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
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Timer].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Timer].map(e => MappersDk.entityToDkSuggestion(e, "TIMER0"));
        }
    },
    [ParamType.Flag]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Flag].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Flag].map(e => MappersDk.entityToDkSuggestion(e, "FLAG0"));
        }
    },
    [ParamType.Room]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Room].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Room].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.RoomAvailability]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.RoomAvailability].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.RoomAvailability].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Power]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Power].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Power].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Lvl]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Lvl].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Lvl].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Button]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Button].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Button].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.AnyCreature]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.AnyCreature].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.AnyCreature].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Binary]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Binary].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Binary].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Zero]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Zero].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Zero].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.KeeperIndex]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.KeeperIndex].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.KeeperIndex].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Door]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Door].some(e => e.val === pdp.arg.value.toUpperCase())
                || pdp.arg.value.startsWith(CUSTOM_ENTITY_PREFIX);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Door].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Trap]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Trap].some(e => e.val === pdp.arg.value.toUpperCase())
                || pdp.arg.value.startsWith(CUSTOM_ENTITY_PREFIX);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Trap].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CampaignFlag]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CampaignFlag].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CampaignFlag].map(e => MappersDk.entityToDkSuggestion(e, "CAMPAIGN_FLAG0"));
        }
    },
    [ParamType.Byte]: {
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value) && Math.abs(parseInt(pdp.arg.value)) <= CONSTRAINTS.maxByte;
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.Rule]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Rule].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Rule].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Text]: {
        check(pdp: ParamDiagProps) {
            return /^".*"$/i.test(pdp.arg.value) && (pdp.arg.value.length - 2) <= CONSTRAINTS.maxTextLen;
        },
        suggest(state: ScriptAnalysis) {
            return [MappersDk.entityToDkSuggestion({ val: `""` }, "", SuggestionKind.Text)];
        }
    },
    [ParamType.Number]: {
        check(pdp: ParamDiagProps) {
            return /^-?\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities([]);
        }
    },
    [ParamType.NonNegNumber]: {
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities([]);
        }
    },
    [ParamType.Party]: {
        check(pdp: ParamDiagProps) {
            return pdp.state.parties.some(p => p.name === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities(state.parties.map(p => p.name));
        }
    },
    [ParamType.NewParty]: {
        check(pdp: ParamDiagProps) {
            return /^\D[_a-zA-Z\d]*$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.Comparison]: {
        check(pdp: ParamDiagProps) {
            return [
                Operators.Eq, Operators.Neq, Operators.Gt,
                Operators.Gte, Operators.Lt, Operators.Lte,
            ].includes(pdp.arg.value as Operators);
        },
        suggest(state: ScriptAnalysis) {
            return COMPARISON_PARAMS[0].allowedTypes.map(at => DK_TYPES[at].suggest(state)).flat();
        }
    },
    [ParamType.AvailabilityComparison]: {
        check(pdp: ParamDiagProps) {
            return [
                Operators.Eq, Operators.Neq, Operators.Gt,
                Operators.Gte, Operators.Lt, Operators.Lte,
            ].includes(pdp.arg.value as Operators);
        },
        suggest(state: ScriptAnalysis) {
            return AVAIL_COMPARISON_PARAMS[0].allowedTypes.map(at => DK_TYPES[at].suggest(state)).flat();
        }
    },
    [ParamType.ControlComparison]: {
        check(pdp: ParamDiagProps) {
            return [
                Operators.Eq, Operators.Neq, Operators.Gt,
                Operators.Gte, Operators.Lt, Operators.Lte,
            ].includes(pdp.arg.value as Operators);
        },
        suggest(state: ScriptAnalysis) {
            return CONTROL_COMPARISON_PARAMS[0].allowedTypes.map(at => DK_TYPES[at].suggest(state)).flat();
        }
    },
    [ParamType.ActionPoint]: {
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
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return ["150", "300", "450", "600", "900", "1200", "2400", "3600", "12000"]
                .map(e => MappersDk.entityToDkSuggestion({ val: e}, "", SuggestionKind.Value));
        }
    },
    [ParamType.Computer]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Computer].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Computer].map(e => MappersDk.entityToDkSuggestion(e, "0"));
        }
    },
    [ParamType.Operation]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Operation].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Operation].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CompProcess]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CompProcess].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CompProcess].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CompCheck]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CompCheck].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CompCheck].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CompEvent]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CompEvent].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CompEvent].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CompGlobal]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CompGlobal].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CompGlobal].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CustomBox]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CustomBox].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CustomBox]
                .slice(0, 5) // suggest just the first five
                .map(e => MappersDk.entityToDkSuggestion(e, "", SuggestionKind.Value));
        }
    },
    [ParamType.Objective]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Objective].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Objective].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Lvl]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Lvl].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Lvl].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CreatureProperty]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CreatureProperty].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CreatureProperty].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CreatureTendency]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.CreatureTendency].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.CreatureTendency].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.DoorConfig]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.DoorConfig].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.DoorConfig].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.ObjectConfig]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.ObjectConfig].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.ObjectConfig].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.TrapConfig]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.TrapConfig].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.TrapConfig].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.SacrificeCmd]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.SacrificeCmd].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.SacrificeCmd].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.PowerLvl]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.PowerLvl].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.PowerLvl].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Spell]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Spell].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Spell].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.GameRule]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.GameRule].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.GameRule].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.TrapTriggerType]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.TrapTriggerType].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.TrapTriggerType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.TrapActivationType]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.TrapActivationType].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.TrapActivationType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Criterion]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Criterion].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Criterion].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.AudioType]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.AudioType].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.AudioType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Subtile]: {
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value)
                && Utils.isBetween(parseInt(pdp.arg.value), CONSTRAINTS.minSubtile, CONSTRAINTS.maxSubtile);
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.Slab]: {
        check(pdp: ParamDiagProps) {
            return /^\d+$/.test(pdp.arg.value)
                && Utils.isBetween(parseInt(pdp.arg.value), CONSTRAINTS.minSlab, CONSTRAINTS.maxSlab);
        },
        suggest(state: ScriptAnalysis) {
            return [];
        }
    },
    [ParamType.HeadFor]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.HeadFor].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.HeadFor].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Creature]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Creature].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Creature].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Global]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Global].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Global].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.CreatureGlobal]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.Global].filter(e => e.creature)
                .some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.Global].filter(e => e.creature).map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.DisplayVarTargetType]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.DisplayVarTargetType].some(e => e.val === pdp.arg.value);
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.DisplayVarTargetType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.FillType]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.FillType].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.FillType].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.LockState]: {
        check(pdp: ParamDiagProps) {
            return DK_ENTITIES[ParamType.LockState].some(e => e.val === pdp.arg.value.toUpperCase());
        },
        suggest(state: ScriptAnalysis) {
            return DK_ENTITIES[ParamType.LockState].map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Range]: {
        check(pdp: ParamDiagProps) {
            return [
                Operators.Rng,
            ].includes(pdp.arg.value as Operators);
        },
        suggest(state: ScriptAnalysis) {
            return suggestEntities([]);
        }
    },
    [ParamType.Unknown]: {
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
