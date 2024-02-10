import { useState, useEffect, FunctionComponent } from "react";

// import types
import { PokemonData } from "../../types/pokemonData";
import { UserStats } from "../../types/userStats";
import { TypeRelations } from "../../types/typeRelations";

// import components
import Button from "../button/Button";
import ChooseRoundPokePage from "../choose-round-poke-page/ChooseRoundPokePage";
import FightPage from "../fight-page/FightPage";

// utils
import { getRandPokemons } from "../../utils/utils_functions";

import { START_ROUND_NUMBER, LAST_ROUND_NUMBER } from "../../utils/constants";

import "./BattlePage.css";

interface BattlePageProps {
  damageRelations: TypeRelations[];
  userPokemons: PokemonData[];
  setUserPokemons: (userPokemons: PokemonData[]) => void;
  setIsOnMyPokemonPage: (isOnMyPokemonPage: boolean) => void;
  userStats: UserStats;
  setUserStats: (userStats: UserStats) => void;
  pokemonsData: PokemonData[];
}

const BattlePage: FunctionComponent<BattlePageProps> = ({
  damageRelations,
  userPokemons,
  setUserPokemons,
  setIsOnMyPokemonPage,
  userStats,
  setUserStats,
  pokemonsData,
}) => {
  // this will instantiate the round number every time the component is mounted
  console.log("BattlePage component mounted");
  const [opponentPokemons, setOpponentPokemons] = useState<PokemonData[]>([]);
  const [roundsUserWon, setRoundsUserWon] = useState(0);
  const [roundNumber, setRoundNumber] = useState(START_ROUND_NUMBER);
  const [isInChoosePokemonPhase, setIsInChoosePokemonPhase] = useState(true);
  const [userPokemonFighterUid, setUserPokemonFighterUid] = useState<
    string | null
  >(null);
  useState<PokemonData | null>(null);

  useEffect(() => {
    const updatedUserPokemons = userPokemons.map((pokemon) => {
      return { ...pokemon, isAlreadyFought: false };
    });
    setUserPokemons(updatedUserPokemons);
  }, []);

  useEffect(() => {
    console.log(
      "or battlePage mounted or pokemonsData changed - generate opponentPokemons for battle"
    );
    // will cause generate opponentPokemons for battle
    const opponentPokemons = getRandPokemons(pokemonsData);
    // update only when pokemonsData is not empty. BattlePage dont have the setter
    // so opponentPokemons will be constant during all battle.
    if (opponentPokemons.length !== 0) {
      console.log("generate opponentPokemons for battle:", opponentPokemons);
      setOpponentPokemons(opponentPokemons);
    }
  }, [pokemonsData]);

  useEffect(() => {
    // will track the fighter pokemon of the user and save that it has already fought
    if (userPokemonFighterUid === null) return;
    const updatedUserPokemons = userPokemons.map((pokemon) => {
      if (pokemon.uid === userPokemonFighterUid) {
        return { ...pokemon, isAlreadyFought: true };
      }
      return pokemon;
    });
    setUserPokemons(updatedUserPokemons);
    // user choosed pokemon so isInChoosePokemonPhase is false
    setIsInChoosePokemonPhase(false);
  }, [userPokemonFighterUid]);

  return (
    <div className="battle-page-container">
      <h1>Battle</h1>
      {/* if isInChoosePokemonPhase use ChooseRoundPokePage and give it the setUserPokemonFighterUid, user and opponent Pokemons */}
      {isInChoosePokemonPhase ? (
        <ChooseRoundPokePage
          setUserPokemonFighterUid={setUserPokemonFighterUid}
          userPokemons={userPokemons}
          setUserPokemons={setUserPokemons}
          opponentPokemons={opponentPokemons}
          setIsOnMyPokemonPage={setIsOnMyPokemonPage} // for the back button
          roundNumber={roundNumber} // so it know when game over, and check which user won.
          roundsUserWon={roundsUserWon} // so it know the winner
        />
      ) : (
        <FightPage
          userPokemons={userPokemons} // so it can take the fighter
          userPokemonFighterUid={userPokemonFighterUid} // so it can take the fighter
          setUserPokemons={setUserPokemons} // so it can update the isWonLastRound
          opponentPokemons={opponentPokemons} // so it can get random 1 for battle
          setOpponentPokemons={setOpponentPokemons} // so it can update the isAlreadyFought
          userStats={userStats}
          setUserStats={setUserStats} // so it can update after round the battlesWon and battlesLost
          roundNumber={roundNumber}
          setRoundNumber={setRoundNumber} // will increase by one after round
          setIsInChoosePokemonPhase={setIsInChoosePokemonPhase}
          damageRelations={damageRelations}
          roundsUserWon={roundsUserWon}
          setRoundsUserWon={setRoundsUserWon} // increase by 1 if user won
        />
      )}

      {/* for debug */}
      {/* <button
        onClick={() => {
          localStorage.clear();
          setIsOnMyPokemonPage(true);
        }}
      >
        Reset Local Storage
      </button> */}
    </div>
  );
};

export default BattlePage;
