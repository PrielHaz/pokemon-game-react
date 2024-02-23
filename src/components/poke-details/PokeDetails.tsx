import { FunctionComponent } from "react";
import { PokemonData } from "../../types/pokemonData";
import { Stat } from "../../types/stat";

import "./PokeDetails.css";

interface PokeDetailsProps {
  // get the pokemon data
  pokemonData: PokemonData;
}

const PokeDetails: FunctionComponent<PokeDetailsProps> = ({
  pokemonData,
}: PokeDetailsProps) => {
  return (
    <div className="poke-details">
      <h2>{pokemonData.name}</h2> <br />
      <div className="flex-row-space-around">
        <h3>Type:</h3>
        <p>{pokemonData.type}</p>;<h3>Height:</h3>
        <p>{pokemonData.height}</p>;<h3>Weight:</h3>
        <p>{pokemonData.weight}</p>
      </div>
      <h3>Stats:</h3>
      <ul>
        {pokemonData.stats.map((stat: Stat) => (
          <li key={stat.name}>
            {stat.name}: {stat.value}
          </li>
        ))}
      </ul>
      <div className="pokemon-battle-stats-container">
        <div className="stat">
          <h3>Wins: </h3>
          <p>{pokemonData.battlesWon}</p>
        </div>
        <div className="stat">
          <h3>Losses:</h3>
          <p>{pokemonData.battlesLost}</p>
        </div>
        <div className="stat">
          <h3>Win Rate:</h3>
          <p>
            {pokemonData.battlesWon === 0 && pokemonData.battlesLost === 0 ? (
              <span className="no-win-rate">No Win Rate</span>
            ) : (
              `${(
                (pokemonData.battlesWon /
                  (pokemonData.battlesWon + pokemonData.battlesLost)) *
                100
              ).toFixed(2)}%`
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PokeDetails;
