import { FunctionComponent } from "react";

interface PokeCardProps {
  isShadowed: boolean;
  pokemonImage: string;
  pokemonName: string;
  showName: boolean;
  handleClick: () => void;
  // it gets a boolean that say that if showName -> show it below\above the image
  showNameBelow?: boolean;
  clickableAnimations?: boolean;
}

import "./PokeCard.css";

const PokeCard: FunctionComponent<PokeCardProps> = ({
  isShadowed,
  pokemonImage,
  pokemonName,
  showName,
  handleClick,
  showNameBelow,
  clickableAnimations,
}: PokeCardProps) => {
  return (
    <div
      className={`poke-card ${isShadowed ? "shadow" : ""} ${
        !clickableAnimations ? "not-clickable" : ""
      }`}
      onClick={handleClick}
    >
      {showName && !showNameBelow && <h3>{pokemonName}</h3>}
      <img src={pokemonImage} alt={pokemonName} />
      {showName && showNameBelow && <h3>{pokemonName}</h3>}
    </div>
  );
};

export default PokeCard;
