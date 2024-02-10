import { PokemonData } from "../types/pokemonData";
import { TypeRelations } from "../types/typeRelations";
import { Stat } from "../types/stat";
import { TOTAL_POKEMONS, TOTAL_POKEMONS_PER_PLAYER } from "./constants";

// inclusive max and min
export const getRandomInt = (min: number, max: number): number => {
  // Ensure the range is inclusive of the maximum value by adding 1
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateUniqueId = (): string => {
  // this function is used to generate a unique id for the pokemon
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// will also assign unique id to each pokemon
export const getRandPokemons = (
  pokemonsData: PokemonData[],
  numPokemons: number = TOTAL_POKEMONS_PER_PLAYER
): PokemonData[] => {
  // if pokemonsData is empty, return empty array
  if (pokemonsData.length === 0) return [];
  // this function is used to get random pokemons
  const randomPokemons: PokemonData[] = [];
  for (let i = 0; i < numPokemons; i++) {
    const randomIndex = getRandomInt(0, pokemonsData.length - 1);
    // copy the pokemon from pokemonsData, push the pokemon and give it unique id
    const pokemon = { ...pokemonsData[randomIndex] };
    pokemon.uid = generateUniqueId();
    randomPokemons.push(pokemon);
  }
  return randomPokemons;
};

export const isUserWon = (roundsUserWon: number, LAST_ROUND_NUMBER: number) => {
  // the user won if it won the majority of the rounds
  let roundsUserNeedsToWin = Math.trunc(LAST_ROUND_NUMBER / 2) + 1;
  console.log(
    `user won: ${roundsUserWon} rounds, to win he needs to win: ${roundsUserNeedsToWin} rounds`
  );
  return roundsUserWon >= roundsUserNeedsToWin;
};

// function that given attackerPokemon, move, defenderPokemon
// calculates the totalPower of this attack by the formula:
// For each of the two Pokémon’s moves, a total power value will be calculated
// using the:  formula:
// TotalPower = (𝑀𝑃 + 𝑃𝐴) * 𝑇𝐹 − 𝑃𝐷
// Where:
// ● MP - Power value of the move.
// ● PA - Pokémon’s base attack stat (one of the six stats of each
// Pokémon).
// ● PD - Other Pokémon’s base defense stat (another one of the six
// stats).
// ● TF - Type factor, determined using the types relations explained in
// Appendix 3 - Type factor.
// Each Pokémon has at least one type. The type factor is either 0, 0.5,
// 1, or 2, describing how efficient the attacker’s type is against the
// defender’s. In the case of a Pokémon having more than one type, only
// the first one is considered, and all other types are ignored.

export const calculateTotalPower: (
  attackerPokemon: PokemonData,
  movePower: number,
  defenderPokemon: PokemonData,
  damageRelations: TypeRelations[]
) => number = (
  attackerPokemon,
  movePower,
  defenderPokemon,
  damageRelations
) => {
  // get the attackerPokemon attack stat
  const attackerAttackStat: Stat | undefined = attackerPokemon.stats.find(
    (stat) => stat.name === "attack"
  );

  if (!attackerAttackStat) {
    throw new Error("attackerPokemon does not have attack stat");
  }

  // get the defenderPokemon defense stat
  const defenderDefenseStat: Stat | undefined = defenderPokemon.stats.find(
    (stat) => stat.name === "defense"
  );

  if (!defenderDefenseStat) {
    throw new Error("defenderPokemon does not have defense stat");
  }

  // get the type factor, iterate over the damageRelations and find the type of the attackerPokemon,
  // then search in the 6 lists of the damageRelations for the type of the defenderPokemon

  const attackerPokemonType = attackerPokemon.type;
  const defenderPokemonType = defenderPokemon.type;

  const attackerTypeDamageRelation = damageRelations.find(
    (relation) => relation.type === attackerPokemonType
  );
  console.log("attackerTypeDamageRelation:", attackerTypeDamageRelation);
  if (!attackerTypeDamageRelation) {
    throw new Error("attackerPokemonType not found in damageRelations");
  }
  const typeRelations = Object.keys(attackerTypeDamageRelation).filter(
    (key) => key !== "type"
  );

  let typeFactor = 1;
  for (let i = 0; i < typeRelations.length; i++) {
    const key = typeRelations[i];
    const value = attackerTypeDamageRelation[key as keyof TypeRelations];
    if (value.includes(defenderPokemonType)) {
      switch (key) {
        case "double_damage_to":
          console.log(
            `attacker type: ${attackerPokemonType} is double effective against defender type: ${defenderPokemonType}!`
          );
          typeFactor = 2;
          break;
        case "half_damage_to":
          console.log(
            `attacker type: ${attackerPokemonType} is not very(half) effective against defender type: ${defenderPokemonType}!`
          );
          typeFactor = 0.5;
          break;
        case "no_damage_to":
          console.log(
            `attacker type: ${attackerPokemonType} is can't do damage to defender type: ${defenderPokemonType}!`
          );
          typeFactor = 0;
          break;
        default:
          console.log(
            `attacker type: ${attackerPokemonType} is normally effective against defender type: ${defenderPokemonType}!`
          );
          typeFactor = 1;
      }
    }
  }

  // calculate the totalPower
  const totalPower =
    (movePower + attackerAttackStat.value) * typeFactor -
    defenderDefenseStat.value;

  console.log(
    `attackerPokemonType: ${attackerPokemonType}, defenderPokemonType: ${defenderPokemonType}`
  );
  console.log(
    `mp: ${movePower}, pa: ${attackerAttackStat.value}, pd: ${defenderDefenseStat.value}, TF: ${typeFactor}`
  );

  return totalPower;
};
