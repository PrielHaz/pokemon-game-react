import { FunctionComponent } from "react";

import { PokemonData } from "../../types/pokemonData";

// constants
import { LAST_ROUND_NUMBER } from "../../utils/constants";

// components
import Button from "../button/Button";
import PokeCard from "../poke-card/PokeCard";

// utils
import { isUserWon } from "../../utils/utils_functions";

// css
import "./ChooseRoundPokePage.css";

interface ChooseRoundPokePageProps {
  setUserPokemonFighterUid: (userPokemonFighterUid: string) => void;
  userPokemons: PokemonData[];
  setUserPokemons: (userPokemons: PokemonData[]) => void;
  opponentPokemons: PokemonData[];
  setIsOnMyPokemonPage: (isOnMyPokemonPage: boolean) => void;
  roundNumber: number;
  roundsUserWon: number;
}

const ChooseRoundPokePage: FunctionComponent<ChooseRoundPokePageProps> = ({
  setUserPokemonFighterUid,
  userPokemons,
  setUserPokemons,
  opponentPokemons,
  setIsOnMyPokemonPage,
  roundNumber,
  roundsUserWon,
}) => {
  const handleClickOnUserPokemon = (pokemon: PokemonData) => {
    if (pokemon.isAlreadyFought) return;
    setUserPokemonFighterUid(pokemon.uid);
    // change to the fight page
    setIsOnMyPokemonPage(false);
  };

  const updateUserPokemonsBattleResults: () => void = () => {
    // this function will assert that isWonLastRound is not null,
    // and then update the usersPokemons isAlreadyFought to false and battlesWon\battlesLost
    const updatedUserPokemons: PokemonData[] = userPokemons.map((pokemon) => {
      if (!pokemon.isAlreadyFought) {
        throw new Error(
          "updateUserPokemonsBattleResults: pokemon.isAlreadyFought is: ${pokemon.isAlreadyFought}"
        );
      }
      // check if the pokemon property: isWonLastRound is null - raise error!! otherwise
      // its bool so if true battlesWon++ else battlesLost++
      if (pokemon.isWonLastRound === null) {
        throw new Error(
          "updateUserPokemonsBattleResults: pokemon.isWonLastRound is null"
        );
      } else if (pokemon.isWonLastRound) {
        return {
          ...pokemon,
          battlesWon: pokemon.battlesWon + 1,
          isAlreadyFought: null,
        };
      } else {
        return {
          ...pokemon,
          battlesLost: pokemon.battlesLost + 1,
          isAlreadyFought: null,
        };
      }
    });
    setUserPokemons(updatedUserPokemons);
  };

  return (
    <div className="choose-round-poke-page-container">
      {/* show the round number / LAST_ROUND_NUMBER, and roundsUserWon */}
      <h2>
        {roundNumber >= LAST_ROUND_NUMBER + 1
          ? "Battle ended. "
          : `Round ${roundNumber} / ${LAST_ROUND_NUMBER}. `}
        Rounds won: {roundsUserWon}
      </h2>
      <h2>Opponent's pokemons</h2>
      {/* show opponentPokemons, unclickable, shadow those that fought */}
      <div className="opponent-pokemons-container">
        {opponentPokemons.map((pokemon) => (
          <PokeCard
            key={pokemon.uid}
            isShadowed={pokemon.isAlreadyFought}
            pokemonImage={pokemon.frontImageUrl}
            pokemonName={pokemon.name}
            showName={true}
            handleClick={() => {}}
            showNameBelow={true}
            clickableAnimations={false} // cause opponent pokemons are not clickable
          />
        ))}
      </div>
      {/*  msg cause we dont want to play the LAST_ROUND_NUMBER + 1 round */}
      {roundNumber === LAST_ROUND_NUMBER + 1 && (
        <div className="last-round-message-container">
          <h2>
            {isUserWon(roundsUserWon, LAST_ROUND_NUMBER)
              ? "You won the battle!"
              : "You lost the battle. Better luck next time!"}
          </h2>
          <Button
            text="Back to My Pokemons"
            colorBeforeHover="blue"
            colorAfterHover="green"
            isClickableAnimations={true}
            onClick={() => {
              setIsOnMyPokemonPage(true);
              updateUserPokemonsBattleResults();
            }}
          />
        </div>
      )}
      <h2>
        Your pokemons
        {/* if its not last round write choose pokemon for next battle */}
        {roundNumber !== LAST_ROUND_NUMBER + 1 && (
          <span> - Choose pokemon for next battle!</span>
        )}
      </h2>
      {/* show userPokemons, clickable(use setUserPokemonFighterUid on the selected one), shadow those that fought */}
      <div className="user-pokemons-container">
        {userPokemons.map((pokemon) => (
          <PokeCard
            key={pokemon.uid}
            isShadowed={pokemon.isAlreadyFought}
            pokemonImage={pokemon.frontImageUrl}
            pokemonName={pokemon.name}
            showName={true}
            handleClick={() => handleClickOnUserPokemon(pokemon)}
            showNameBelow={false}
            clickableAnimations={true} // cause user pokemons are clickable
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseRoundPokePage;
