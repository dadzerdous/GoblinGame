import type { Choice, Player } from "@shared/schema";

interface ChoiceButtonsProps {
  choices: Choice[];
  onChoice: (choiceId: string) => void;
  disabled: boolean;
  player: Player;
}

const riskColors = {
  low: "text-green-400",
  moderate: "text-orange-400", 
  high: "text-red-400",
  info: "text-blue-400",
};

const riskIcons = {
  low: "fas fa-shield-alt",
  moderate: "fas fa-exclamation-triangle",
  high: "fas fa-skull",
  info: "fas fa-lightbulb",
};

const riskLabels = {
  low: "Lower Risk",
  moderate: "Moderate Risk",
  high: "High Risk", 
  info: "Gain Information",
};

export default function ChoiceButtons({ choices, onChoice, disabled, player }: ChoiceButtonsProps) {
  const getChoiceLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, etc.
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          onClick={() => onChoice(choice.id)}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-game-slate/40 to-game-navy/40 hover:from-game-amber/20 hover:to-game-gold/20 border border-game-slate/50 hover:border-game-amber/50 rounded-xl p-6 text-left transition-all duration-300 group hover:shadow-lg hover:shadow-game-amber/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-game-amber/20 border-2 border-game-amber rounded-full flex items-center justify-center mr-4 group-hover:bg-game-amber/30 transition-colors">
              <span className="font-semibold text-game-amber">
                {getChoiceLabel(index)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-crimson text-lg font-semibold text-game-gold mb-2">
                {choice.text}
              </h3>
              <div className="flex items-center mt-3 text-sm text-game-light/60 flex-wrap gap-4">
                {choice.requirement && (
                  <div className="flex items-center">
                    <i className="fas fa-cog mr-2"></i>
                    <span>Requires: {choice.requirement}</span>
                  </div>
                )}
                {choice.risk && (
                  <div className={`flex items-center ${riskColors[choice.risk]}`}>
                    <i className={`${riskIcons[choice.risk]} mr-1`}></i>
                    <span>{riskLabels[choice.risk]}</span>
                  </div>
                )}
              </div>
              
              {/* Show potential effects */}
              {choice.effects && (
                <div className="mt-2 text-xs text-game-light/50 flex flex-wrap gap-2">
                  {choice.effects.health && (
                    <span className={choice.effects.health > 0 ? "text-green-400" : "text-red-400"}>
                      {choice.effects.health > 0 ? "+" : ""}{choice.effects.health} Health
                    </span>
                  )}
                  {choice.effects.energy && (
                    <span className={choice.effects.energy > 0 ? "text-blue-400" : "text-orange-400"}>
                      {choice.effects.energy > 0 ? "+" : ""}{choice.effects.energy} Energy
                    </span>
                  )}
                  {choice.effects.gold && (
                    <span className="text-game-gold">
                      {choice.effects.gold > 0 ? "+" : ""}{choice.effects.gold} Gold
                    </span>
                  )}
                  {choice.effects.addItems && choice.effects.addItems.length > 0 && (
                    <span className="text-purple-400">
                      +{choice.effects.addItems.length} Items
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
