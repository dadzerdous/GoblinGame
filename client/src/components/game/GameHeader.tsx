interface GameHeaderProps {
  onSave: () => void;
}

export default function GameHeader({ onSave }: GameHeaderProps) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="bg-game-navy/30 backdrop-blur-sm border-b border-game-slate/30 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-cinzel text-3xl lg:text-4xl font-semibold text-game-gold">
          The Mystic Chronicles
        </h1>
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-game-slate/30 rounded-lg transition-colors"
            title="Settings"
          >
            <i className="fas fa-cog text-game-light/70 hover:text-game-light"></i>
          </button>
          <button 
            className="p-2 hover:bg-game-slate/30 rounded-lg transition-colors"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            <i className="fas fa-expand text-game-light/70 hover:text-game-light"></i>
          </button>
          <button 
            className="p-2 hover:bg-game-slate/30 rounded-lg transition-colors"
            onClick={onSave}
            title="Save Game"
          >
            <i className="fas fa-save text-game-light/70 hover:text-game-light"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
