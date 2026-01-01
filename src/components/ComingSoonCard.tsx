import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/data/movies";

interface ComingSoonCardProps {
  movie: Movie;
}

export function ComingSoonCard({ movie }: ComingSoonCardProps) {
  return (
    <div className="group cursor-pointer min-w-[200px] md:min-w-[240px]">
      <div className="relative overflow-hidden rounded-lg mb-3 card-hover">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
        {/* Coming Soon Badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-destructive text-destructive-foreground">
            Coming Soon
          </Badge>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full border-white text-white hover:bg-white hover:text-black text-sm"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{movie.releaseDate}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {movie.genre.slice(0, 2).map((g) => (
            <Badge
              key={g}
              variant="secondary"
              className="text-xs font-normal"
            >
              {g}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
