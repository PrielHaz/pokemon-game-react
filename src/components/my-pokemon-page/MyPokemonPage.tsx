import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";

// import constants
import {
  TOTAL_POKEMONS,
  TOTAL_POKEMONS_PER_PLAYER,
} from "../../utils/constants";

// import utilitiy functions
import { getRandPokemons } from "../../utils/utils_functions";

// import types
import { PokemonData } from "../../types/pokemonData";
import { UserStats } from "../../types/userStats";

// import components
import PokeCard from "../poke-card/PokeCard";
import PokeDetails from "../poke-details/PokeDetails";
import Button from "../button/Button";
import PresentUserStats from "../present-user-stats/PresentUserStats";

import "./MyPokemonPage.css";

interface MyPokemonPageProps {
  pokemonsData: PokemonData[];
  userPokemons: PokemonData[];
  setUserPokemons: (userPokemons: PokemonData[]) => void;
  userStats: UserStats;
  setUserStats: (userStats: UserStats) => void;
  defaultUserStats: UserStats;
  setIsOnMyPokemonPage: (isOnMyPokemonPage: boolean) => void;
}

const MyPokemonPage: FunctionComponent<MyPokemonPageProps> = ({
  // destructure props
  pokemonsData,
  userPokemons,
  setUserPokemons,
  userStats,
  setUserStats,
  defaultUserStats,
  setIsOnMyPokemonPage,
}) => {
  const [choosedPokemon, setChoosedPokemon] = useState<PokemonData | null>(
    null
  );

  const handleChoosePokemon = (pokemon: PokemonData) => {
    // if already choosed, unchoose it as said in the pdf
    if (choosedPokemon?.uid === pokemon.uid) {
      setChoosedPokemon(null);
      return;
    }
    console.log("At my pokemon page choosed pokemon:", pokemon);
    setChoosedPokemon(pokemon);
  };

  const handleStartOver = () => {
    // get the user new pokemons
    const randomUserPokemons = getRandPokemons(
      pokemonsData,
      TOTAL_POKEMONS_PER_PLAYER
    );
    // just to make sure battlesWon and battlesLost are 0, in general pokemonsData always
    // have 0 statistics.
    randomUserPokemons.forEach((pokemon) => {
      pokemon.battlesWon = 0;
      pokemon.battlesLost = 0;
    });

    setUserPokemons(randomUserPokemons); // it will also reset the b
    // piazza said reset the user stats
    setUserStats(defaultUserStats);
    // reset choosedPokemon
    setChoosedPokemon(null);
  };

  return (
    <div className="my-pokemon-page-container">
      <div className="start-over-container">
        <button onClick={handleStartOver}>Start Over</button>
      </div>
      <h1>My Pokemon Page</h1>
      {/* button to clear localS */}
      {/* <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Clear local storage
      </button> */}
      <div className="choose-and-show-poke-details-container">
        <div className="choose-poke-to-show-details-container">
          <h2>Choose a Pokemon to show details</h2>
          <div className="pokemons-container">
            {userPokemons.map((pokemon) => (
              <PokeCard
                key={pokemon.uid}
                isShadowed={choosedPokemon?.uid === pokemon.uid} // shadow the choosed poke only
                pokemonImage={pokemon.frontImageUrl}
                pokemonName="" // according to the pdf, pokemons displayed with sprite only
                showName={true}
                showNameBelow={true}
                handleClick={() => handleChoosePokemon(pokemon)}
                clickableAnimations={true}
              />
            ))}
          </div>
          <PresentUserStats
            battlesWon={userStats.battlesWon}
            battlesLost={userStats.battlesLost}
          />
        </div>
        <div className="separator"></div>
        <div className="show-poke-details-container">
          {/* if no pokemon selected show:{No Pokemon Selected} only, otherwise use PokeDetails */}
          {choosedPokemon ? (
            <PokeDetails pokemonData={choosedPokemon} />
          ) : (
            <h2>No Pokemon Selected</h2>
          )}
        </div>
      </div>
      {/* Let's battle button */}
      <Button
        text="Let's Battle"
        colorBeforeHover="red"
        colorAfterHover="#45a049"
        onClick={() => {
          console.log("Let's Battle button clicked");
          setIsOnMyPokemonPage(false);
          setChoosedPokemon(null);
        }}
        isClickableAnimations={true}
      />
    </div>
  );
};

export default MyPokemonPage;
