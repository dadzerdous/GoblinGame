import type { Player } from "@shared/schema";

interface PlayerStatusProps {
  player: Player;
}

export default function PlayerStatus({ player }: PlayerStatusProps) {
  const healthPercentage = (player.health / player.maxHealth) * 100;
  const energyPercentage = (player.energy / player.maxEnergy) * 100;

  return (
    <div className="mb-8">
      <h2 className="font-cinzel text-xl font-semibold text-game-gold mb-4 flex items-center">
        <i className="fas fa-user-shield mr-2"></i>
        Player Status
      </h2>
      
      <div className="bg-game-slate/30 rounded-lg p-4 mb-4">
        <div className="flex items-center mb-3">
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
            alt="Character Avatar" 
            className="w-12 h-12 rounded-full border-2 border-game-gold mr-3"
          />
          <div>
            <h3 className="font-crimson font-semibold">{player.name}</h3>
            <p className="text-sm text-game-light/70">Level {player.level}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm flex items-center">
              <i className="fas fa-heart text-red-400 mr-1"></i> 
              Health
            </span>
            <div className="flex-1 mx-2 bg-game-dark rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
            <span className="text-sm">{player.health}/{player.maxHealth}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm flex items-center">
              <i className="fas fa-bolt text-blue-400 mr-1"></i> 
              Energy
            </span>
            <div className="flex-1 mx-2 bg-game-dark rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${energyPercentage}%` }}
              />
            </div>
            <span className="text-sm">{player.energy}/{player.maxEnergy}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm flex items-center">
              <i className="fas fa-coins text-game-amber mr-1"></i> 
              Gold
            </span>
            <span className="text-sm font-semibold text-game-gold">{player.gold}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
