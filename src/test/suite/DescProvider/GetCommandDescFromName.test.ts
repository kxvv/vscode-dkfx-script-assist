import * as assert from "assert";
import { DescProvider } from "../../../DescProvider";
import { CommandDesc } from "../../../model/CommandDesc";
import { Exp } from "../../../model/Exp";
import { ParamType } from "../../../model/ParamType";
import { RootLvl } from "../../../model/RootLvl";
import { createExp } from "../TestUtils";

suite("Suite for DescProvider::" + DescProvider.getCommandDesc.name, () => {
    test("simple 2 params", () => {
        const res: CommandDesc = {
            doc: "Sets up a timer that increases by 1 every game turn from when it was triggered.",
            opts: 0,
            timerWriteAt: [0, 1],
            params: [
                {
                    allowedTypes: [ParamType.Player],
                    optional: false,
                    name: "player"
                },
                {
                    allowedTypes: [ParamType.Timer],
                    optional: false,
                    name: "timer",
                }
            ]
        };
        assert.deepStrictEqual(
            DescProvider.getCommandDesc("SET_TIMER"),
            res
        );
    });

    test("2 + an alternative", () => {
        const res: CommandDesc = {
            msgSlotAt: 0,
            opts: 1,
            doc: "Works like DISPLAY_OBJECTIVE, but instead of using a string from translations, allows to type it directly.",
            params: [
                {
                    allowedTypes: [ParamType.MsgNumber],
                    optional: false,
                    name: "message number",
                },
                {
                    allowedTypes: [ParamType.Text],
                    optional: false,
                    name: "message",
                },
                {
                    allowedTypes: [ParamType.AllPlayers, ParamType.Location],
                    optional: true,
                    name: "zoom target",
                },
            ]
        };
        assert.deepStrictEqual(
            DescProvider.getCommandDesc("QUICK_OBJECTIVE"),
            res
        );
    });

    test("sign change EQ", () => {
        const res: CommandDesc = {
            opts: 0,
            doc: "Adjusts the research value for individual rooms or spells and even for a specific player.",
            rootLvl: RootLvl.Enforce,
            signChanges: [
                {
                    arg: "ROOM",
                    check: "EQ",
                    in: 1,
                    out: 2,
                    outTypes: [
                        ParamType.Room
                    ],
                },
                {
                    arg: "MAGIC",
                    check: "EQ",
                    in: 1,
                    out: 2,
                    outTypes: [
                        ParamType.Power
                    ],
                }
            ],
            params: [
                {
                    allowedTypes: [ParamType.Player],
                    optional: false,
                    name: "player"
                },
                {
                    allowedTypes: [ParamType.ResearchType],
                    optional: false,
                    name: "research type"
                },
                {
                    allowedTypes: [ParamType.Power],
                    optional: false,
                    name: "room or power",
                },
                {
                    allowedTypes: [ParamType.NonNegNumber],
                    optional: false,
                    name: "research value",
                },
            ]
        };

        const exp: Exp = {
            ...createExp("RESEARCH"),
            args: [
                createExp("PLAYER0"),
                createExp("MAGIc"),
                createExp("POWER_OBEY"),
                createExp("10000"),
            ]
        };
        assert.deepStrictEqual(
            DescProvider.getCommandDesc(exp),
            res
        );
    });

    test("create party", () => {
        const res: CommandDesc = {
            doc: "This command tells the game to expect a party with a specific name.",
            opts: 0,
            rootLvl: RootLvl.Enforce,
            params: [
                {
                    allowedTypes: [ParamType.NewParty],
                    optional: false,
                    name: "unique party name",
                },
            ],
            partyPutAt: 0
        };
        assert.deepStrictEqual(
            DescProvider.getCommandDesc("CREATE_PARTY"),
            res
        );
    });
});