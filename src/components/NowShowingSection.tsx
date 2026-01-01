import { MovieCard } from "./MovieCard";
import { nowShowingMovies } from "@/data/movies";

export function NowShowingSection() {
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {nowShowingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}
