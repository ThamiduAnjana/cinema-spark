import { Play } from "lucide-react";
import { Movie } from "@/data/movies";
import { cn } from "@/lib/utils";

interface TrailerCardProps {
  movie: Movie;
  isActive?: boolean;
  onClick?: () => void;
}

export function TrailerCard({ movie, isActive, onClick }: TrailerCardProps) {
  return (
    <div
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 min-w-[160px] md:min-w-[200px]",
        isActive
          ? "ring-2 ring-primary scale-105"
          : "opacity-70 hover:opacity-100 hover:scale-102"
      )}
      onClick={onClick}
    >
      <img
        src={movie.backdrop}
        alt={movie.title}
        className="w-full aspect-video object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
          <Play className="h-4 w-4 text-primary-foreground fill-current ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-xs font-medium line-clamp-1">
          {movie.title}
        </p>
      </div>
    </div>
  );
}
