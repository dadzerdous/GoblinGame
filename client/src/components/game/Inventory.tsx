interface InventoryProps {
  inventory: string[];
}

const itemIcons: Record<string, string> = {
  sword: "fas fa-sword",
  health_potion: "fas fa-flask",
  scroll: "fas fa-scroll",
  ancient_knowledge: "fas fa-book-open",
  ancient_scroll: "fas fa-scroll",
  wisdom_tome: "fas fa-book",
  golden_amulet: "fas fa-gem",
  mystical_crystal: "fas fa-diamond",
  protective_ward: "fas fa-shield-alt",
  temple_map: "fas fa-map",
  healing_potion: "fas fa-heart",
  torch: "fas fa-fire",
};

const itemColors: Record<string, string> = {
  sword: "text-game-amber",
  health_potion: "text-red-400",
  scroll: "text-game-light",
  ancient_knowledge: "text-blue-400",
  ancient_scroll: "text-purple-400",
  wisdom_tome: "text-indigo-400",
  golden_amulet: "text-yellow-400",
  mystical_crystal: "text-cyan-400",
  protective_ward: "text-green-400",
  temple_map: "text-orange-400",
  healing_potion: "text-pink-400",
  torch: "text-red-500",
};

export default function Inventory({ inventory }: InventoryProps) {
  const slots = Array.from({ length: 8 }, (_, i) => inventory[i] || null);

  return (
    <div className="mb-8">
      <h2 className="font-cinzel text-xl font-semibold text-game-gold mb-4 flex items-center">
        <i className="fas fa-backpack mr-2"></i>
        Inventory
      </h2>
      
      <div className="grid grid-cols-4 gap-2">
        {slots.map((item, index) => (
          <div
            key={index}
            className={`aspect-square rounded-lg border flex items-center justify-center transition-colors cursor-pointer group ${
              item
                ? "bg-game-slate/30 border-game-slate/50 hover:bg-game-slate/50"
                : "bg-game-slate/20 border-2 border-dashed border-game-slate/30"
            }`}
            title={item ? item.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Empty slot"}
          >
            {item ? (
              <i 
                className={`${itemIcons[item] || "fas fa-cube"} ${itemColors[item] || "text-game-light"} text-lg group-hover:scale-110 transition-transform`}
              />
            ) : (
              <i className="fas fa-plus text-game-slate text-sm"></i>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
