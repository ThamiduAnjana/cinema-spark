import { MovieCard } from "./MovieCard";
import { MovieGridSkeleton } from "./MovieCardSkeleton";
import { EmptyState, ErrorState } from "./EmptyState";
import { useNowShowingMovies } from "@/hooks/use-movies";

export function NowShowingSection() {
  const { movies, isLoading, isError, refetch } = useNowShowingMovies(1, 12);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Now Showing
          </h2>
          <a
            href="#"
            className="text-primary hover:text-cinema-gold-dark font-medium transition-colors"
          >
            View All →
          </a>
        </div>

        {isLoading && <MovieGridSkeleton count={12} />}

        {isError && (
          <ErrorState
            title="Failed to load movies"
            description="We couldn't load the movie listings. Please try again."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && movies.length === 0 && (
          <EmptyState
            title="No movies showing"
            description="There are no movies currently showing. Check back soon!"
          />
        )}

        {!isLoading && !isError && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
