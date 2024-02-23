import { FunctionComponent, useEffect, useState } from "react";

// types
import { PokemonData } from "../../types/pokemonData";
import { UserStats } from "../../types/userStats";
import { MoveData } from "../../types/moveData";
import { TypeRelations } from "../../types/typeRelations";

// utils
import {
  calculateTotalPower,
  getRandomInt,
  isUserWon,
} from "../../utils/utils_functions";

// components
import FightingPoke from "../fighting-poke/FightingPoke";
import Button from "../button/Button";

// constants
import { MOVES_PER_POKEMON, LAST_ROUND_NUMBER } from "../../utils/constants";

// css
import "./FightPage.css";

interface FightPageProps {
  userPokemons: PokemonData[];
  userPokemonFighterUid: string;
  setUserPokemons: (userPokemons: PokemonData[]) => void;
  opponentPokemons: PokemonData[];
  setOpponentPokemons: (opponentPokemons: PokemonData[]) => void;
  userStats: UserStats;
  setUserStats: (userStats: UserStats) => void;
  roundNumber: number;
  setRoundNumber: (roundNumber: number) => void;
  setIsInChoosePokemonPhase: (isInChoosePokemonPhase: boolean) => void;
  damageRelations: TypeRelations[];
  roundsUserWon: number;
  setRoundsUserWon: (roundsUserWon: number) => void;
}

const FightPage: FunctionComponent<FightPageProps> = ({
  userPokemons,
  userPokemonFighterUid,
  setUserPokemons,
  opponentPokemons,
  setOpponentPokemons,
  userStats,
  setUserStats,
  roundNumber,
  setRoundNumber,
  setIsInChoosePokemonPhase,
  damageRelations,
  roundsUserWon,
  setRoundsUserWon,
}) => {
  const [opponentFighter, setOpponentFighter] = useState<PokemonData | null>(
    null
  );
  const [userFighter, setUserFighter] = useState<PokemonData | null>(null);
  const [opponentMoves, setOpponentMoves] = useState<MoveData[]>([]);
  const [userMoves, setUserMoves] = useState<MoveData[]>([]);
  const [roundOutcomeMessages, setRoundOutcomeMessages] = useState<{
    userMoveMessage: string;
    opponentMoveMessage: string;
    winnerMessage: string;
  } | null>(null);
  const [isMoveChosed, setIsMoveChosed] = useState(false);

  // Function to select a random subset of moves
  const getRandomMoves = (moves: MoveData[]) => {
    if (moves.length <= MOVES_PER_POKEMON) return moves;

    let selectedMoves = [];
    let indexesAlreadyChosed = new Set();
    while (
      selectedMoves.length < MOVES_PER_POKEMON &&
      indexesAlreadyChosed.size < moves.length // to prevent infinite loop if there are less than MOVES_PER_POKEMON moves
    ) {
      let index = getRandomInt(0, moves.length - 1);
      if (!indexesAlreadyChosed.has(index)) {
        selectedMoves.push(moves[index]);
        indexesAlreadyChosed.add(index);
      }
    }
    return selectedMoves;
  };

  const onFightPageMount = () => {
    // choose random opponent pokemon to fight from the pokemons that are not already fought
    const notFoughtOpponentPokemons = opponentPokemons.filter(
      (pokemon) => !pokemon.isAlreadyFought
    );
    if (notFoughtOpponentPokemons.length === 0)
      throw new Error("no opponent pokemon to fight");
    const randomOpponentFighter =
      notFoughtOpponentPokemons[
        getRandomInt(0, notFoughtOpponentPokemons.length - 1)
      ];
    setOpponentFighter(randomOpponentFighter);

    // set the userFighter
    const userFighter = userPokemons.find(
      (pokemon) => pokemon.uid === userPokemonFighterUid
    );
    if (!userFighter) throw new Error("user fighter pokemon not found");
    setUserFighter(userFighter);
    console.log(
      "FightPage mounted with random opponentFighter:",
      randomOpponentFighter
    );
    console.log("and userFighter:", userFighter);

    // generate random moves for the opponent and the user
    const opponentMoves = getRandomMoves(randomOpponentFighter.moves);
    setOpponentMoves(opponentMoves);
    const userMoves = getRandomMoves(userFighter.moves);
    setUserMoves(userMoves);
  };
  useEffect(() => {
    onFightPageMount();
  }, []);

  const handleChooseMove = (move: MoveData) => {
    // take random opponent move
    const randomMoveIndex = getRandomInt(0, opponentMoves.length - 1);
    const opponentMove = opponentMoves[randomMoveIndex];
    // set the isAlreadyFought of the opponent to true using setOpponentPokemons
    const updatedOpponentPokemons = opponentPokemons.map(
      (pokemon: PokemonData) => {
        if (pokemon.uid === opponentFighter?.uid) {
          return { ...pokemon, isAlreadyFought: true };
        }
        return pokemon;
      }
    );
    setOpponentPokemons(updatedOpponentPokemons);

    // check who won the round
    const userTotalPower: number = calculateTotalPower(
      userFighter,
      move.mp,
      opponentFighter,
      damageRelations
    );
    const opponentTotalPower: number = calculateTotalPower(
      opponentFighter,
      opponentMove.mp,
      userFighter,
      damageRelations
    );
    let isUserWonRound: boolean = false;
    console.log(
      "userTotalPower:",
      userTotalPower,
      " vs opponentTotalPower:",
      opponentTotalPower
    );
    // pdf said tie means user wins so we used: >=
    if (userTotalPower >= opponentTotalPower) {
      console.log("user won the round");
      isUserWonRound = true;
    }

    const updatedUserPokemons = userPokemons.map((pokemon: PokemonData) => {
      if (pokemon.uid === userPokemonFighterUid) {
        // if the battle will over as said in piazza - it will update the pokemon stats
        return { ...pokemon, isWonLastRound: isUserWonRound };
      }
      return pokemon;
    });
    setUserPokemons(updatedUserPokemons);

    // if it's last round, check if user won the battle
    if (roundNumber === LAST_ROUND_NUMBER) {
      console.log("It was the last round, check if user won the battle");
      if (isUserWon(roundsUserWon + 1, LAST_ROUND_NUMBER)) {
        console.log("user won the whole battle, update its stats to:", {
          ...userStats,
          battlesWon: userStats.battlesWon + 1,
        });
        // update userStats
        setUserStats({
          ...userStats,
          battlesWon: userStats.battlesWon + 1,
        });
      } else {
        console.log("user lost the whole battle, update its stats to:", {
          ...userStats,
          battlesLost: userStats.battlesLost + 1,
        });
        // update userStats
        setUserStats({
          ...userStats,
          battlesLost: userStats.battlesLost + 1,
        });
      }
    }
    setRoundsUserWon(roundsUserWon + (isUserWonRound ? 1 : 0));
    setRoundOutcomeMessages({
      userMoveMessage: `${userFighter?.name} used ${move.name} with total power: ${userTotalPower}`,
      opponentMoveMessage: `${opponentFighter?.name} used ${opponentMove.name} with total power: ${opponentTotalPower}.`,
      winnerMessage: `Your Pokemon ${
        isUserWonRound ? "won" : "lost"
      } the round! Click continue to
      ${
        roundNumber === LAST_ROUND_NUMBER
          ? " see the total battle outcome"
          : " go to the next round!"
      }`,
    });
    setIsMoveChosed(true);
  };

  return (
    <div className="fight-page-container">
      <FightingPoke
        isPokeCardLeft={false}
        isPokeCardShadowed={false}
        pokemonImage={opponentFighter?.frontImageUrl}
        pokemonName={opponentFighter?.name}
        showName={true}
        showNameBelow={true}
        pokeCardCliclableAnimations={false}
        keyPrefix="opponent"
        moves={opponentMoves}
        buttonColorBeforeHover="grey"
        buttonColorAfterHover="grey"
        onMoveClick={() => {}} // opponent moves are not clickable
        movesClickableAnimations={false}
      />

      {roundOutcomeMessages && (
        <div className="round-outcome-messages-container">
          <div className="user-move-message">
            {roundOutcomeMessages.userMoveMessage}
          </div>
          <div className="opponent-move-message">
            {roundOutcomeMessages.opponentMoveMessage}
          </div>
          <div className="winner-message">
            {roundOutcomeMessages.winnerMessage}
          </div>
          <Button
            text={
              roundNumber === LAST_ROUND_NUMBER
                ? "See total battle outcome"
                : "Go to the next round!"
            }
            colorBeforeHover="violet"
            colorAfterHover="green"
            onClick={() => {
              // inc the roundNumber
              setRoundNumber(roundNumber + 1);
              // set the isInChoosePokemonPhase to true
              setIsInChoosePokemonPhase(true);
              // reset the roundOutcomeMessages
              setRoundOutcomeMessages(null);
            }}
            isClickableAnimations={true}
          />
        </div>
      )}

      <div className="user-fighting-poke-container">
        <FightingPoke
          isPokeCardLeft={true}
          isPokeCardShadowed={false}
          pokemonImage={userFighter?.backImageUrl}
          pokemonName={userFighter?.name}
          showName={true}
          showNameBelow={true}
          pokeCardCliclableAnimations={true}
          keyPrefix="user"
          moves={userMoves}
          buttonColorBeforeHover="blue"
          buttonColorAfterHover="#45a049"
          onMoveClick={isMoveChosed ? () => {} : handleChooseMove}
          movesClickableAnimations={isMoveChosed ? false : true}
        />
      </div>
    </div>
  );
};

export default FightPage;
