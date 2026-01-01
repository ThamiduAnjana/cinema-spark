import { Badge } from "@/components/ui/badge";
import { Movie } from "@/data/movies";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 card-hover">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-semibold text-sm hover:bg-cinema-gold-dark transition-colors">
              Book Now
            </button>
          </div>
        </div>
        {/* Rating Badge */}
        {movie.rating > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
            ★ {movie.rating}
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{movie.language}</span>
          <span>•</span>
          <span>{movie.duration}</span>
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
