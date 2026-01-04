import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Calendar, Globe, Film, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNowShowingMovies } from "@/hooks/use-movies";
import { TrailerModal } from "./TrailerModal";

export function HeroSlider() {
  const navigate = useNavigate();
  const { movies, isLoading, isError } = useNowShowingMovies(1, 5);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Reset slide index when movies change
  useEffect(() => {
    if (movies.length > 0 && currentSlide >= movies.length) {
      setCurrentSlide(0);
    }
  }, [movies.length, currentSlide]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || movies.length === 0) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating, movies.length],
  );

  const nextSlide = useCallback(() => {
    if (movies.length === 0) return;
    goToSlide((currentSlide + 1) % movies.length);
  }, [currentSlide, goToSlide, movies.length]);

  const prevSlide = useCallback(() => {
    if (movies.length === 0) return;
    goToSlide((currentSlide - 1 + movies.length) % movies.length);
  }, [currentSlide, goToSlide, movies.length]);

  // Auto-slide (pause when trailer is open)
  useEffect(() => {
    if (isPaused || movies.length === 0 || isTrailerOpen) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, movies.length, isTrailerOpen]);

  const handleWatchTrailer = () => {
    if (movie?.trailerUrl) {
      setIsTrailerOpen(true);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="relative h-[75vh] min-h-[550px] max-h-[850px] w-full bg-[#0B0D14] flex items-center justify-center">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 space-y-4 w-full max-w-xl">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="w-48 sm:w-56 md:w-64 lg:w-72 aspect-[2/3] rounded-xl" />
        </div>
      </section>
    );
  }

  // Error or empty state - show fallback
  if (isError || movies.length === 0) {
    return (
      <section className="relative h-[75vh] min-h-[550px] max-h-[850px] w-full bg-[#0B0D14] flex items-center justify-center">
        <div className="text-center text-white">
          <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No movies available</p>
        </div>
      </section>
    );
  }

  const movie = movies[currentSlide];

  return (
    <>
      <section
        className="relative h-[75vh] min-h-[550px] max-h-[850px] w-full overflow-hidden"
        style={{ backgroundColor: "#0B0D14" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Slides with Inline Background Images */}
        {movies.map((m, index) => (
          <div
            key={m.id}
            data-backdrop={m.backdrop}
            className={cn(
              "hero-slide absolute inset-0 transition-all duration-700 ease-out",
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105",
            )}
            style={{
              backgroundImage: `url(${m.backdrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              transition: "transform 8000ms ease-out, opacity 700ms ease-out",
            }}
          >
            {/* Primary Dark Gradient Overlay - Left to Right */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(11,13,20,0.95) 0%, rgba(11,13,20,0.75) 40%, rgba(11,13,20,0.45) 70%, rgba(11,13,20,0.25) 100%)",
              }}
            />

            {/* Secondary Top-Bottom Gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,13,20,0.5) 0%, transparent 30%, transparent 70%, rgba(11,13,20,0.9) 100%)",
              }}
            />

            {/* Patchy Color Overlay - Warm Tones */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{
                background: `
                  radial-gradient(ellipse 80% 60% at 85% 20%, rgba(255,120,40,0.25) 0%, transparent 55%),
                  radial-gradient(ellipse 70% 50% at 90% 80%, rgba(220,80,50,0.2) 0%, transparent 50%)
                `,
              }}
            />

            {/* Patchy Color Overlay - Cool Tones */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply"
              style={{
                background: `
                  radial-gradient(ellipse 60% 80% at 10% 90%, rgba(40,80,180,0.2) 0%, transparent 55%),
                  radial-gradient(ellipse 50% 50% at 5% 30%, rgba(60,40,120,0.15) 0%, transparent 50%)
                `,
              }}
            />

            {/* Vignette Effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(11,13,20,0.7) 100%)",
              }}
            />
          </div>
        ))}

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-16 w-full py-8">
            {/* Left Content */}
            <div key={currentSlide} className="flex-1 text-center lg:text-left space-y-5 animate-hero-text-enter">
              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                <Film className="w-3 h-3 mr-1" />
                Now Showing
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight tracking-tight">
                {movie.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-5 text-white/80 text-sm md:text-base">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  {movie.runtime}
                </span>
                {movie.releaseDate && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    {movie.releaseDate}
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  {movie.language}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {movie.genres.map((g) => (
                  <Badge
                    key={g}
                    variant="outline"
                    className="border-white/40 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                  >
                    {g}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto lg:mx-0 line-clamp-3 leading-relaxed">
                {movie.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate(`/movie-booking?movie=${movie.movie_ref}`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base md:text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  Book Now
                </Button>
                {movie.trailerUrl && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWatchTrailer}
                    className="border-white/40 text-white bg-white/5 hover:bg-white/20 backdrop-blur-sm px-6 py-6 text-base md:text-lg transition-all duration-300 hover:scale-105 gap-2"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Watch Trailer
                  </Button>
                )}
              </div>
            </div>

            {/* Right Side - Poster Card */}
            <div
              key={`poster-${currentSlide}`}
              className="shrink-0 animate-hero-poster-enter order-first lg:order-last"
            >
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 via-transparent to-primary/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Poster */}
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-48 sm:w-56 md:w-64 lg:w-72 h-auto rounded-xl shadow-2xl object-cover aspect-[2/3] ring-1 ring-white/20"
                  />

                  {/* Play Button Overlay */}
                  {movie.trailerUrl && (
                    <button
                      onClick={handleWatchTrailer}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 md:h-10 md:w-10 text-white fill-white ml-1" />
                      </div>
                    </button>
                  )}

                  {/* Rating Badge */}
                  {movie.rating > 0 && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1">
                      <span className="text-white">★</span> {movie.rating}
                    </div>
                  )}

                  {/* Floating Badge */}
                  <div className="absolute -bottom-3 -left-3 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-medium border border-white/20 shadow-lg">
                    🎬 In Cinemas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {movies.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 md:h-7 md:w-7 text-white group-hover:text-primary transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 md:h-7 md:w-7 text-white group-hover:text-primary transition-colors" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {movies.length > 1 && (
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "w-8 bg-primary shadow-lg shadow-primary/50"
                    : "w-2.5 bg-white/40 hover:bg-white/60",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className={cn(
              "h-full bg-primary transition-all",
              !isPaused && movies.length > 1 && !isTrailerOpen && "animate-progress",
            )}
            style={{
              width:
                isPaused || movies.length <= 1 || isTrailerOpen
                  ? `${((currentSlide + 1) / movies.length) * 100}%`
                  : undefined,
            }}
          />
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        trailerUrl={movie?.trailerUrl ?? null}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        movieTitle={movie?.title}
      />
    </>
  );
}
