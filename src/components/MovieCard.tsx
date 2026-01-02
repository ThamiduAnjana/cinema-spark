import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MovieDetailsModal } from "./MovieDetailsModal";
import { TransformedMovie } from "@/services/movie-service";

interface MovieCardProps {
  movie: TransformedMovie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent modal from opening if clicking on Book Now button
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    setIsModalOpen(true);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movie-booking?movie=${movie.id}`);
  };

  return (
    <>
      <div className="group cursor-pointer" onClick={handleCardClick}>
        <div className="relative overflow-hidden rounded-lg mb-3 card-hover">
          {/* Placeholder while image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={movie.poster}
            alt={movie.title}
            className={`w-full aspect-[2/3] object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Fallback to placeholder on error
              (e.target as HTMLImageElement).src = "/placeholder.svg";
              setImageLoaded(true);
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <button 
                onClick={handleBookNow}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
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
            <span>{movie.runtime}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((g) => (
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

      <MovieDetailsModal
        movie={movie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
