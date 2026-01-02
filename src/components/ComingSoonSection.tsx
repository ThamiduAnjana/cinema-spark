import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MovieCarouselSkeleton } from "./MovieCardSkeleton";
import { EmptyState, ErrorState } from "./EmptyState";
import { MovieDetailsModal } from "./MovieDetailsModal";
import { useUpcomingMovies } from "@/hooks/use-movies";
import { TransformedMovie } from "@/services/movie-service";

export function ComingSoonSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { movies, isLoading, isError, refetch } = useUpcomingMovies(1, 10);
  const [selectedMovie, setSelectedMovie] = useState<TransformedMovie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 260;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = (movie: TransformedMovie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleBookNow = (e: React.MouseEvent, movieId: string) => {
    e.stopPropagation();
    navigate(`/movie-booking?movie=${movieId}`);
  };

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Coming Soon
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading && <MovieCarouselSkeleton count={5} />}

        {isError && (
          <ErrorState
            title="Failed to load upcoming movies"
            description="We couldn't load the upcoming movies. Please try again."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && movies.length === 0 && (
          <EmptyState
            title="No upcoming movies"
            description="There are no upcoming movies at the moment. Check back soon!"
          />
        )}

        {!isLoading && !isError && movies.length > 0 && (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="snap-start flex-shrink-0 w-[240px] group cursor-pointer"
                onClick={() => handleCardClick(movie)}
              >
                <div className="relative overflow-hidden rounded-lg mb-3 card-hover">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <button 
                        onClick={(e) => handleBookNow(e, movie.id)}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors"
                      >
                        Notify Me
                      </button>
                    </div>
                  </div>
                  {/* Release Date Badge */}
                  {movie.releaseDate && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                      {movie.releaseDate}
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
            ))}
          </div>
        )}
      </div>

      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
