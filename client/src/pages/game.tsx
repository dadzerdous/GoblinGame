import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Player, Story, Choice } from "@shared/schema";
import PlayerStatus from "@/components/game/PlayerStatus";
import Inventory from "@/components/game/Inventory";
import QuestLog from "@/components/game/QuestLog";
import StoryDisplay from "@/components/game/StoryDisplay";
import ChoiceButtons from "@/components/game/ChoiceButtons";
import GameHeader from "@/components/game/GameHeader";

export default function Game() {
  const [sessionId, setSessionId] = useState<string>("");
  const { toast } = useToast();

  // Initialize session
  useEffect(() => {
    const storedSessionId = localStorage.getItem("adventure_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      initializeSession();
    }
  }, []);

  const initializeSession = async () => {
    try {
      const response = await apiRequest("POST", "/api/player", {});
      const player: Player = await response.json();
      setSessionId(player.sessionId);
      localStorage.setItem("adventure_session_id", player.sessionId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize game session",
        variant: "destructive",
      });
    }
  };

  // Get player data
  const { data: player, isLoading: playerLoading } = useQuery<Player>({
    queryKey: ["/api/player", sessionId],
    enabled: !!sessionId,
  });

  // Get current story
  const { data: story, isLoading: storyLoading } = useQuery<Story>({
    queryKey: ["/api/story", player?.currentStoryId],
    enabled: !!player?.currentStoryId,
  });

  // Make choice mutation
  const makeChoiceMutation = useMutation({
    mutationFn: async ({ choiceId }: { choiceId: string }) => {
      if (!player || !story) throw new Error("Player or story not found");
      
      const response = await apiRequest("POST", "/api/choice", {
        sessionId: player.sessionId,
        storyId: story.id,
        choiceId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Update player data in cache
      queryClient.setQueryData(["/api/player", sessionId], data.player);
      
      // Update story data in cache
      if (data.nextStory) {
        queryClient.setQueryData(["/api/story", data.nextStory.id], data.nextStory);
      }
      
      toast({
        title: "Choice Made",
        description: "Your story continues...",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process your choice",
        variant: "destructive",
      });
    },
  });

  const saveGame = async () => {
    try {
      toast({
        title: "Game Saved",
        description: "Your progress has been saved automatically",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save game",
        variant: "destructive",
      });
    }
  };

  const handleChoice = (choiceId: string) => {
    makeChoiceMutation.mutate({ choiceId });
  };

  if (!sessionId || playerLoading || storyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-game-dark via-game-navy to-game-slate flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-game-amber"></div>
        <span className="ml-3 text-game-light/70">Loading adventure...</span>
      </div>
    );
  }

  if (!player || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-game-dark via-game-navy to-game-slate flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-game-light mb-4">Game Not Found</h2>
          <p className="text-game-light/70">Failed to load game data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-dark via-game-navy to-game-slate font-inter text-game-light">
      <div className="min-h-screen flex flex-col lg:flex-row">
        
        {/* Sidebar */}
        <aside className="lg:w-80 bg-game-navy/50 backdrop-blur-sm border-r border-game-slate/30 p-6 order-2 lg:order-1">
          <PlayerStatus player={player} />
          <Inventory inventory={player.inventory} />
          <QuestLog questProgress={player.questProgress} />
        </aside>

        {/* Main Game Area */}
        <main className="flex-1 flex flex-col order-1 lg:order-2">
          <GameHeader onSave={saveGame} />
          
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <StoryDisplay 
                story={story} 
                isLoading={makeChoiceMutation.isPending}
              />
              
              <ChoiceButtons
                choices={story.choices}
                onChoice={handleChoice}
                disabled={makeChoiceMutation.isPending}
                player={player}
              />

              {/* Game Controls */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-game-slate/30">
                <button 
                  className="flex items-center px-4 py-2 bg-game-slate/30 hover:bg-game-slate/50 rounded-lg transition-colors text-game-light/70 hover:text-game-light"
                  onClick={() => {
                    toast({
                      title: "Previous",
                      description: "Story navigation coming soon...",
                    });
                  }}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Previous
                </button>
                
                <div className="flex items-center space-x-2 text-game-light/60">
                  <i className="fas fa-bookmark"></i>
                  <span className="text-sm">Auto-save enabled</span>
                </div>
                
                <button 
                  className="flex items-center px-4 py-2 bg-game-amber/20 hover:bg-game-amber/30 border border-game-amber/50 rounded-lg transition-colors text-game-amber hover:text-game-gold"
                  onClick={() => {
                    toast({
                      title: "Hint",
                      description: "Try examining your surroundings more carefully...",
                    });
                  }}
                >
                  <i className="fas fa-lightbulb mr-2"></i>
                  Hint
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
