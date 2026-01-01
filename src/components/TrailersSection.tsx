import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrailerCard } from "./TrailerCard";
import { nowShowingMovies } from "@/data/movies";

export function TrailersSection() {
  const trailerMovies = nowShowingMovies.slice(0, 6);
  const [activeTrailer, setActiveTrailer] = useState(trailerMovies[0]);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
          Latest Trailers
        </h2>

        {/* Featured Trailer */}
        <div className="relative mb-6 rounded-xl overflow-hidden aspect-video max-w-4xl mx-auto">
          <img
            src={activeTrailer.backdrop}
            alt={activeTrailer.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-cinema-gold-dark text-primary-foreground gap-2 px-8 py-6"
            >
              <Play className="h-6 w-6 fill-current" />
              Play Trailer
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="text-white text-xl md:text-2xl font-display font-bold mb-2">
              {activeTrailer.title}
            </h3>
            <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-2xl">
              {activeTrailer.description}
            </p>
          </div>
        </div>

        {/* Trailer Thumbnails */}
        <div
          className="flex gap-4 overflow-x-auto pb-4 justify-start md:justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trailerMovies.map((movie) => (
            <TrailerCard
              key={movie.id}
              movie={movie}
              isActive={movie.id === activeTrailer.id}
              onClick={() => setActiveTrailer(movie)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
