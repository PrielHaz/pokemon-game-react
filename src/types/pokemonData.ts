import { MoveData } from "./moveData";
import { Stat } from "./stat";

export class PokemonData {
  constructor(
    public readonly name: string,
    public readonly id: number, // pokemon id in pokeapi
    public readonly height: number,
    public readonly weight: number,
    public readonly moves: MoveData[],
    public readonly type: string, // take first type only
    // holds hp, attack, defense, special-attack, special-defense, speed
    public readonly stats: Stat[],
    // image for back and front urls
    public readonly backImageUrl: string,
    public readonly frontImageUrl: string,
    public battlesLost: number = 0,
    public battlesWon: number = 0,
    public uid: string = "", // unique id for the pokemon, cause user may have 2 from same pokemon
    public isAlreadyFought: boolean = false, // save if participated in 1 of the 3 rounds already
    public isWonLastRound: boolean | null = null // save if won the last round
  ) {}
}
