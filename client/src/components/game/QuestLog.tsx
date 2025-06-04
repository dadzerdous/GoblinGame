interface QuestLogProps {
  questProgress: Record<string, number>;
}

const questTitles: Record<string, string> = {
  ancient_temple: "The Ancient Temple",
  lost_artifact: "The Lost Artifact",
};

const questDescriptions: Record<string, string> = {
  ancient_temple: "Find the entrance to the mysterious temple",
  lost_artifact: "Retrieve the stolen magical artifact",
};

export default function QuestLog({ questProgress }: QuestLogProps) {
  const quests = Object.entries(questProgress);

  return (
    <div>
      <h2 className="font-cinzel text-xl font-semibold text-game-gold mb-4 flex items-center">
        <i className="fas fa-book-open mr-2"></i>
        Quest Log
      </h2>
      
      <div className="space-y-3">
        {quests.map(([questId, progress]) => {
          const isActive = progress > 0 && progress < 100;
          const isCompleted = progress >= 100;
          
          return (
            <div
              key={questId}
              className={`rounded-lg p-3 border-l-4 ${
                isCompleted
                  ? "bg-green-900/20 border-green-400"
                  : isActive
                  ? "bg-game-slate/30 border-game-amber"
                  : "bg-game-slate/20 border-game-light/30"
              }`}
            >
              <h4 className={`font-crimson font-semibold text-sm mb-1 ${
                isCompleted
                  ? "text-green-400"
                  : isActive
                  ? "text-game-light"
                  : "text-game-light/60"
              }`}>
                {questTitles[questId] || questId}
                {isCompleted && <i className="fas fa-check ml-2"></i>}
              </h4>
              <p className={`text-xs ${
                isCompleted
                  ? "text-green-400/80"
                  : isActive
                  ? "text-game-light/70"
                  : "text-game-light/50"
              }`}>
                {questDescriptions[questId] || "No description available"}
              </p>
              <div className="flex items-center mt-2">
                <div className="flex-1 bg-game-dark rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-400"
                        : isActive
                        ? "bg-game-amber"
                        : "bg-game-light/30"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <span className={`text-xs ml-2 ${
                  isCompleted
                    ? "text-green-400"
                    : isActive
                    ? "text-game-amber"
                    : "text-game-light/50"
                }`}>
                  {Math.min(progress, 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
