// App.tsx

import { useEffect, useState, FunctionComponent } from "react";

import "./App.css";
// Import your components
import MyPokemonPage from "../my-pokemon-page/MyPokemonPage";
import BattlePage from "../battle-page/BattlePage";

// import types
import { PokemonData } from "../../types/pokemonData";
import { TypeRelations } from "../../types/typeRelations";
import { UserStats } from "../../types/userStats";

// import constants
import {
  TOTAL_POKEMONS,
  TOTAL_POKEMONS_PER_PLAYER,
} from "../../utils/constants";

// import utilitiy functions
import { getRandPokemons } from "../../utils/utils_functions";

// API imports
import { fetchPokemonsAux, fetchDamageRelationsAux } from "../../api/pokeApi";

interface AppProps {}

const App: FunctionComponent<AppProps> = () => {
  // State to toggle between pages
  const [isOnMyPokemonPage, setIsOnMyPokemonPage] = useState(true);
  // damageRelations is list of objects, every object has type, and 6 keys for damage relations:
  // double_damage_from, double_damage_to, half_damage_from, half_damage_to, no_damage_from, no_damage_to
  const [damageRelations, setDamageRelations] = useState<TypeRelations[]>([]);
  const [pokemonsData, setPokemonsData] = useState<PokemonData[]>([]);
  const [userPokemons, setUserPokemons] = useState<PokemonData[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const defaultUserStats: UserStats = {
    battlesWon: 0,
    battlesLost: 0,
  };
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);

  const fetchAndSetPokemons = async () => {
    try {
      // Fetch Pokemons and set pokemonsData state
      const pokemonsDataFetched: PokemonData[] = await fetchPokemonsAux(
        TOTAL_POKEMONS
      );
      setPokemonsData(pokemonsDataFetched);

      const userPokemonsInLocalStorage: string | null =
        localStorage.getItem("userPokemons");
      if (userPokemonsInLocalStorage) {
        setUserPokemons(JSON.parse(userPokemonsInLocalStorage));
      } else {
        const randomUserPokemons: PokemonData[] = getRandPokemons(
          pokemonsDataFetched,
          TOTAL_POKEMONS_PER_PLAYER
        );
        setUserPokemons(randomUserPokemons);
      }
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    }
  };

  const fetchDamageRelations = async () => {
    try {
      // Fetch damageRelations and set damageRelations state
      const damageRelationsFetched: TypeRelations[] =
        await fetchDamageRelationsAux();
      console.log("fetched damageRelations:", damageRelationsFetched);
      setDamageRelations(damageRelationsFetched);
    } catch (error) {
      console.error("Error fetching damageRelations:", error);
    }
  };

  const handleMount = async () => {
    console.log("App component start mounting");
    await fetchAndSetPokemons();
    await fetchDamageRelations();
    const userStatsInLocalStorage: string | null =
      localStorage.getItem("userStats");
    if (userStatsInLocalStorage) {
      console.log("userStats found in local storage");
      setUserStats(JSON.parse(userStatsInLocalStorage));
    } else {
      console.log("userStats not found in local storage, setting to default");
      setUserStats(defaultUserStats);
    }
    setIsMounted(true);
  };
  useEffect(() => {
    handleMount();
    console.log("setting isMounted to true");
  }, []); // Empty dependency array means this runs once on component mount

  useEffect(() => {
    if (!isMounted) return;
    // console.log("updating userPokemons local storage to:", userPokemons);
    localStorage.setItem("userPokemons", JSON.stringify(userPokemons));
  }, [userPokemons]);

  // track userStats changes and update local storage
  useEffect(() => {
    if (!isMounted) return;
    console.log("updating userStats local storage to:", userStats);
    localStorage.setItem("userStats", JSON.stringify(userStats));
  }, [userStats]);

  return (
    <div className="all-app-container">
      {isMounted ? (
        isOnMyPokemonPage ? (
          <MyPokemonPage
            pokemonsData={pokemonsData}
            userPokemons={userPokemons}
            setUserPokemons={setUserPokemons} // for the start over button
            userStats={userStats}
            setUserStats={setUserStats}
            defaultUserStats={defaultUserStats}
            setIsOnMyPokemonPage={setIsOnMyPokemonPage}
          />
        ) : (
          <BattlePage
            damageRelations={damageRelations}
            userPokemons={userPokemons}
            setUserPokemons={setUserPokemons} // for update battlesWon and battlesLost
            setIsOnMyPokemonPage={setIsOnMyPokemonPage}
            userStats={userStats}
            setUserStats={setUserStats} // for update battlesWon and battlesLost
            pokemonsData={pokemonsData}
          />
        )
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};

export default App;
