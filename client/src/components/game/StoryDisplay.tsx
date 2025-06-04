import type { Story } from "@shared/schema";

interface StoryDisplayProps {
  story: Story;
  isLoading: boolean;
}

export default function StoryDisplay({ story, isLoading }: StoryDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-game-slate/20 to-game-navy/30 backdrop-blur-sm rounded-2xl border border-game-slate/30 p-8 mb-8 shadow-2xl animate-fade-in">
      
      {/* Story Image */}
      {story.imageUrl && (
        <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={story.imageUrl} 
            alt={story.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Story Chapter */}
      <div className="text-center mb-6">
        <span className="text-game-amber font-cinzel text-sm font-semibold tracking-wider uppercase">
          {story.chapter}
        </span>
        <h2 className="font-cinzel text-2xl lg:text-3xl font-semibold text-game-gold mt-1">
          {story.title}
        </h2>
      </div>

      {/* Story Text */}
      <div className="prose prose-lg max-w-none" id="story-text">
        {story.content.map((paragraph, index) => (
          <p 
            key={index}
            className="font-crimson text-lg leading-relaxed text-game-light mb-6"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-game-amber"></div>
          <span className="ml-3 text-game-light/70">Loading next chapter...</span>
        </div>
      )}
    </div>
  );
}
