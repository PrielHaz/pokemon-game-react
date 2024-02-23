import { FunctionComponent } from "react";
import { MoveData } from "../../types/moveData";
import Button from "../button/Button";
import PokeCard from "../poke-card/PokeCard";

// css
import "./FightingPoke.css";

interface FightingPokeProps {
  isPokeCardLeft: boolean;
  isPokeCardShadowed: boolean;
  pokemonImage: string;
  pokemonName: string;
  showName: boolean;
  showNameBelow: boolean;
  pokeCardCliclableAnimations: boolean;
  keyPrefix: string;
  moves: MoveData[];
  buttonColorBeforeHover: string;
  buttonColorAfterHover: string;
  onMoveClick: (move: MoveData) => void;
  movesClickableAnimations: boolean;
}

const FightingPoke: FunctionComponent<FightingPokeProps> = ({
  isPokeCardLeft,
  isPokeCardShadowed,
  pokemonImage,
  pokemonName,
  showName,
  showNameBelow,
  pokeCardCliclableAnimations,
  keyPrefix,
  moves,
  buttonColorBeforeHover,
  buttonColorAfterHover,
  onMoveClick,
  movesClickableAnimations,
}: FightingPokeProps) => {
  const pokeCardElement: JSX.Element = (
    <PokeCard
      isShadowed={isPokeCardShadowed}
      pokemonImage={pokemonImage}
      pokemonName={pokemonName}
      showName={showName}
      handleClick={() => {}} // cause the pokemon is never clickable during fight
      showNameBelow={showNameBelow}
      clickableAnimations={pokeCardCliclableAnimations}
    />
  );
  // var for the moves container
  const movesContainer: JSX.Element = (
    <div className={`moves-container`}>
      {moves.map((move: MoveData) => (
        <Button
          key={`${keyPrefix}-${move.name}`}
          colorBeforeHover={buttonColorBeforeHover}
          colorAfterHover={buttonColorAfterHover}
          text={`${move.name}: ${move.mp} power`}
          onClick={() => onMoveClick(move)}
          isClickableAnimations={movesClickableAnimations}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`poke-card-and-moves-container ${
        isPokeCardLeft ? "poke-left" : "poke-right"
      }`}
    >
      {isPokeCardLeft ? pokeCardElement : movesContainer}
      {isPokeCardLeft ? movesContainer : pokeCardElement}
    </div>
  );
};

export default FightingPoke;
