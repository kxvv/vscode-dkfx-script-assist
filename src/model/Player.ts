import { DkEntity } from "./DkEntity";

const COLOR_NAMES: Record<string, string> = {
    "RED": "PLAYER0",
    "BLUE": "PLAYER1",
    "GREEN": "PLAYER2",
    "YELLOW": "PLAYER3",
    "WHITE": "PLAYER_GOOD",
};

const PLAYER_INDICES: Record<string, number> = {
    "PLAYER0": 0,
    "PLAYER1": 1,
    "PLAYER2": 2,
    "PLAYER3": 3,
    "PLAYER_GOOD": 4,
    "PLAYER_NEUTRAL": 5,
    "ALL_PLAYERS": 6,
};

class Player {
    public passedName: string;
    public uppercasedName: string;
    public indexedName: string;
    public playerIndex: string;
    public entity: DkEntity | null;

    public static fromName(name: string): Player {
        const result: Player = new Player;
        let uppercasedName: string | undefined = name.toUpperCase();
        if (uppercasedName[0] !== "P") {
            uppercasedName = COLOR_NAMES[uppercasedName];
        }
        return result;
    }
}
