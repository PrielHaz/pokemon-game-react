import { FunctionComponent } from "react";
import "./PresentUserStats.css";

interface PresentUserStatsProps {
  battlesWon: number;
  battlesLost: number;
}

const PresentUserStats: FunctionComponent<PresentUserStatsProps> = ({
  battlesWon,
  battlesLost,
}) => {
  const totalBattles = battlesWon + battlesLost;
  const winPercentage =
    totalBattles > 0 ? (battlesWon / totalBattles) * 100 : 0;
  const fillPercentage = `${winPercentage}%`;

  return (
    <div className="user-stats-container">
      <h3>User Stats:</h3>
      <p>
        {totalBattles === 0 ? (
          <span>You haven't played yet</span>
        ) : (
          `You won ${battlesWon} out of ${totalBattles} battles`
        )}
      </p>
      <div className="circle-progress-container">
        <div
          className="circle-progress"
          style={{ "--fill-percentage": fillPercentage }}
          data-percentage={winPercentage.toFixed(0)}
        >
          <span>{winPercentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
export default PresentUserStats;
