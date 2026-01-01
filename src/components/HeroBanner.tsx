import { Play, Clock, Calendar, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { featuredMovie } from "@/data/movies";

export function HeroBanner() {
  const movie = featuredMovie;

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] bg-hero overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${movie.backdrop})` }}
      >
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-hero via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <Badge className="bg-primary text-primary-foreground mb-4">
              Now Showing
            </Badge>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-hero-foreground mb-4 leading-tight">
              {movie.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/80 mb-6">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {movie.duration}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {movie.releaseDate}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {movie.language}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
              {movie.genre.map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="border-white/30 text-white/90"
                >
                  {g}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto lg:mx-0 line-clamp-3">
              {movie.description}
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-primary hover:bg-cinema-gold-dark text-primary-foreground font-semibold px-8 py-6 text-lg"
            >
              Book Tickets Now
            </Button>
          </div>

          {/* Right Side - Poster Card */}
          <div className="relative shrink-0 animate-slide-up">
            <div className="relative group">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-64 md:w-72 h-auto rounded-xl shadow-2xl object-cover aspect-[2/3]"
              />
              {/* Play Trailer Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black gap-2"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Watch Trailer
                </Button>
              </div>
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold text-sm">
                ★ {movie.rating}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
