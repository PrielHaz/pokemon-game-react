import { PokemonData } from "../types/pokemonData";
import { MoveData } from "../types/moveData";
import { Stat } from "../types/stat";
import { TypeRelations } from "../types/typeRelations";

export const fetchPokemonsAux = async (
  totalPokemons: number
): Promise<PokemonData[]> => {
  const pokemonsData = localStorage.getItem("pokemonsData");
  // if it exist with len of totalPokemons return it
  if (pokemonsData && JSON.parse(pokemonsData).length === totalPokemons) {
    console.log("pokemonsData found in local storage");
    // return it
    return JSON.parse(pokemonsData);
  }
  try {
    const fetchPromises: Promise<any>[] = [];
    for (let i = 1; i <= totalPokemons; i++) {
      fetchPromises.push(
        fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`).then((res) =>
          res.json()
        )
      );
    }

    const results = await Promise.all(fetchPromises);

    const movesUrls: string[] = results.map((data: any) =>
      data.moves.map((move: any) => move.move.url)
    );

    // remove duplicates
    const movesUrlsSet = new Set(movesUrls.flat());

    // create a dictionary from the movesUrlsSet,
    // where the key is the key is the name and the value is the power
    const movesDict: { [key: string]: number } = {};
    const movesPromises: Promise<any>[] = Array.from(movesUrlsSet).map((url) =>
      fetch(url).then((res) => res.json())
    );
    const moves = await Promise.all(movesPromises);
    moves.forEach((move: any) => {
      movesDict[move.name] = move.power ? move.power : 0;
    });

    const pokemonsData: PokemonData[] = results.map((data: any) => {
      const movesData: MoveData[] = data.moves.map((move: any) => ({
        name: move.move.name,
        mp: movesDict[move.move.name],
      }));

      const types: string[] = data.types.map((type: any) => type.type.name);
      const stats: Stat[] = data.stats.map((stat: any) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      }));
      return new PokemonData(
        data.name,
        data.id,
        data.height,
        data.weight,
        movesData,
        types[0], // Assuming we only take the first type for simplicity
        stats,
        data.sprites.back_default,
        data.sprites.front_default
      );
    });

    localStorage.setItem("pokemonsData", JSON.stringify(pokemonsData));

    return pokemonsData;
  } catch (error) {
    console.error("Error fetching pokemons:", error);
    throw new Error("Error fetching pokemons");
  }
};

export const fetchDamageRelationsAux = async (): Promise<TypeRelations[]> => {
  const damageRelationsCache = localStorage.getItem("damageRelations");
  if (damageRelationsCache) {
    console.log("Damage relations found in local storage");
    return JSON.parse(damageRelationsCache);
  }

  try {
    // Fetch the list of all Pokémon types
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    const { results: types } = await response.json();

    // Fetch damage relations for each type concurrently
    const damageRelationsPromises = types.map((type: any) =>
      fetch(type.url).then((response) => response.json())
    );
    const damageRelationsResults = await Promise.all(damageRelationsPromises);

    // Transform the fetched data into the TypeRelations interface format
    const damageRelations: TypeRelations[] = damageRelationsResults.map(
      ({ name, damage_relations }) => ({
        type: name,
        double_damage_from: damage_relations.double_damage_from.map(
          (d) => d.name
        ),
        double_damage_to: damage_relations.double_damage_to.map((d) => d.name),
        half_damage_from: damage_relations.half_damage_from.map((d) => d.name),
        half_damage_to: damage_relations.half_damage_to.map((d) => d.name),
        no_damage_from: damage_relations.no_damage_from.map((d) => d.name),
        no_damage_to: damage_relations.no_damage_to.map((d) => d.name),
      })
    );

    // Optionally, cache the results in localStorage
    localStorage.setItem("damageRelations", JSON.stringify(damageRelations));

    return damageRelations;
  } catch (error) {
    console.error("Error fetching damage relations:", error);
    throw new Error("Error fetching damage relations");
  }
};
