import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Play, MapPin, Heart, Navigation, ChevronLeft, User, ArrowLeft, Film, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MovieCard } from "@/components/MovieCard";
import { TrailerModal } from "@/components/TrailerModal";
import { useMovieByRef } from "@/hooks/use-booking-movies";
import { TransformedMovieWithShowtimes, TransformedMovie } from "@/services/movie-service";
import { TMDB_LOGO_BASE } from "@/lib/api-config";
import { Theater, Showtime } from "@/types/api";

// Generate dates for the next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    dates.push({
      id: i.toString(),
      month: monthNames[date.getMonth()],
      day: date.getDate().toString().padStart(2, '0'),
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()],
    });
  }
  
  return dates;
};

// Group showtimes by format
const groupShowtimesByFormat = (showtimes: Showtime[]) => {
  const grouped: Record<string, Showtime[]> = {};
  showtimes.forEach((st) => {
    const format = st.format || "Standard";
    if (!grouped[format]) {
      grouped[format] = [];
    }
    grouped[format].push(st);
  });
  return grouped;
};

// Convert TransformedMovieWithShowtimes to TransformedMovie for MovieCard
function toTransformedMovie(movie: TransformedMovieWithShowtimes): TransformedMovie {
  return {
    id: movie.id,
    ref: movie.ref,
    title: movie.title,
    tagline: movie.tagline,
    description: movie.description,
    runtime: movie.runtime,
    runtimeMinutes: movie.runtimeMinutes,
    language: movie.language,
    rating: movie.rating,
    releaseDate: movie.releaseDate,
    genres: movie.genres,
    poster: movie.poster,
    backdrop: movie.backdrop,
    galleryImages: movie.galleryImages,
    cast: movie.cast,
    crew: movie.crew,
    productionCompanies: movie.productionCompanies,
    trailerUrl: movie.trailerUrl,
    movieType: movie.movieType,
  };
}

export default function MovieBooking() {
  const navigate = useNavigate();
  const { movieRef } = useParams<{ movieRef: string }>();
  
  const { movie, allMovies, isLoading, error, isError, notFound } = useMovieByRef(movieRef || "");
  
  const [selectedDate, setSelectedDate] = useState("0");
  const [dates] = useState(generateDates);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handleTimeslotClick = (theater: Theater, showtime: Showtime) => {
    if (!movie) return;
    navigate(`/select-seats?movie=${movie.ref || movie.id}&cinema=${encodeURIComponent(theater.name)}&time=${encodeURIComponent(showtime.time)}&format=${encodeURIComponent(showtime.format || 'Standard')}&language=${encodeURIComponent(showtime.language)}`);
  };

  // Get other movies for "Also Showing" section
  const alsoShowingMovies = allMovies?.filter((m) => m.id !== movie?.id).slice(0, 5) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D14]">
        <header className="bg-[#0B0D14] border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <section className="relative">
          <Skeleton className="h-[350px] w-full" />
        </section>
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  // API Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-[#0B0D14] flex flex-col">
        <header className="bg-[#0B0D14] border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">BACK</span>
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Movie</h2>
            <p className="text-white/60 mb-6">Unable to connect to the server. Please check your connection and try again.</p>
            <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Movie not found state (API succeeded but movie doesn't exist)
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0B0D14] flex flex-col">
        <header className="bg-[#0B0D14] border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">BACK</span>
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
            <p className="text-white/60 mb-6">The movie you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Still loading or no movie yet
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0B0D14]">
        <header className="bg-[#0B0D14] border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <section className="relative">
          <Skeleton className="h-[350px] w-full" />
        </section>
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D14]">
      {/* Header */}
      <header className="bg-[#0B0D14] border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Back + Breadcrumb */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">BACK</span>
            </button>
            
            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center gap-3 text-sm">
              <span className="text-primary font-medium border-b-2 border-primary pb-1">CHOOSE CINEMA</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
              <span className="text-white/40">SELECT SEATS</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
              <span className="text-white/40">PAYMENT</span>
            </nav>
          </div>
          
          {/* Right: Location, Theme, Login */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span>Trincomalee</span>
            </div>
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary hover:bg-primary/10 gap-2"
            >
              <User className="w-4 h-4" />
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Movie Hero Section */}
      <section className="relative">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 h-[400px]"
          style={{
            backgroundImage: `url(${movie.backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14] via-[#0B0D14]/80 to-[#0B0D14]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative container mx-auto px-4 pt-8 pb-6">
          <div className="flex gap-6 items-start">
            {/* Poster */}
            <div className="relative shrink-0 group">
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-36 md:w-48 h-auto rounded-xl shadow-2xl object-cover aspect-[2/3] ring-2 ring-white/10"
              />
              {movie.trailerUrl && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer"
                  onClick={() => setIsTrailerOpen(true)}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Movie Info */}
            <div className="flex-1 pt-4">
              {/* Movie Type Badge */}
              <Badge className={cn(
                "mb-3 text-xs font-bold",
                movie.movieType === "now_showing" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-amber-500 hover:bg-amber-600 text-black"
              )}>
                <Film className="w-3 h-3 mr-1" />
                {movie.movieType === "now_showing" ? "NOW SHOWING" : "UPCOMING"}
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-wide">
                {movie.title}
              </h1>
              
              {movie.tagline && (
                <p className="text-white/60 italic mb-3 text-sm md:text-base">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mb-4">
                {movie.rating > 0 && (
                  <>
                    <Badge className="bg-primary/90 text-white">
                      ★ {movie.rating.toFixed(1)}
                    </Badge>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                  </>
                )}
                <span>{movie.runtime}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.releaseDate}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.genres.join(', ')}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.language}</span>
              </div>
              
              {/* Production Companies */}
              {movie.productionCompanies.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-white/50 mb-2">Production</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {movie.productionCompanies.slice(0, 4).map((company) => (
                      <div key={company.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                        {company.logo_path ? (
                          <img 
                            src={`${TMDB_LOGO_BASE}${company.logo_path}`}
                            alt={company.name}
                            className="h-5 w-auto object-contain brightness-0 invert opacity-80"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-xs text-white/70">{company.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Trailer Button */}
              {movie.trailerUrl && (
                <Button 
                  onClick={() => setIsTrailerOpen(true)}
                  className="bg-primary/90 hover:bg-primary text-white gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Date Picker */}
      <section className="bg-[#0B0D14] border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date) => (
              <button
                key={date.id}
                onClick={() => setSelectedDate(date.id)}
                className={cn(
                  "flex flex-col items-center px-4 py-3 rounded-lg min-w-[80px] transition-all",
                  selectedDate === date.id 
                    ? "bg-primary text-white" 
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                <span className="text-xs font-medium">{date.month}</span>
                <span className="text-xl font-bold">{date.day}</span>
                <span className="text-xs">{date.dayName}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="bg-[#1A1D25] py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-end gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-green-500" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              Filling Fast
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-500" />
              Sold Out
            </span>
          </div>
        </div>
      </section>

      {/* Cinema Listings */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          {movie.theaters && movie.theaters.length > 0 ? (
            movie.theaters.map((theater) => {
              const groupedShowtimes = groupShowtimesByFormat(theater.showtimes);
              
              return (
                <div key={theater.id} className="bg-[#1A1D25] border border-white/10 rounded-xl overflow-hidden mb-6">
                  {/* Theater Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div>
                      <h3 className="font-bold text-white">{theater.name}</h3>
                      <p className="text-xs text-white/50">{theater.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {theater.distance && (
                        <span className="text-xs text-white/50">{theater.distance}</span>
                      )}
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Navigation className="w-4 h-4 text-white/60" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Heart className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Showtimes */}
                  <div className="p-4 space-y-6">
                    {Object.entries(groupedShowtimes).map(([format, showtimes]) => (
                      <div key={format}>
                        <h4 className="text-xs font-bold text-white/70 mb-3">{format}</h4>
                        <div className="flex flex-wrap gap-3">
                          {showtimes.map((showtime, idx) => (
                            <button
                              key={idx}
                              onClick={() => showtime.available && handleTimeslotClick(theater, showtime)}
                              disabled={!showtime.available}
                              className={cn(
                                "flex flex-col items-center px-4 py-2 rounded-lg border-2 min-w-[100px] transition-all",
                                showtime.available 
                                  ? showtime.filling_fast
                                    ? "border-primary/80 bg-primary/10 hover:bg-primary/20 cursor-pointer"
                                    : "border-green-500/80 bg-green-500/10 hover:bg-green-500/20 cursor-pointer"
                                  : "border-white/20 bg-white/5 cursor-not-allowed opacity-50"
                              )}
                            >
                              <span className="text-[10px] text-white/60 font-medium">{showtime.language}</span>
                              <span className={cn(
                                "text-sm font-bold",
                                showtime.available 
                                  ? showtime.filling_fast ? "text-primary" : "text-green-500"
                                  : "text-white/30"
                              )}>
                                {showtime.time}
                              </span>
                              {showtime.screen_name && (
                                <span className="text-[9px] text-white/40">{showtime.screen_name}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-[#1A1D25] border border-white/10 rounded-xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">No Showtimes Available</h3>
              <p className="text-white/50 text-sm">Check back later for available showtimes.</p>
            </div>
          )}
        </div>
      </section>

      {/* Also Showing Section */}
      {alsoShowingMovies.length > 0 && (
        <section className="py-8 bg-[#0B0D14]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Also Showing</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-white/20 text-white/60 hover:bg-white/10 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg border border-white/20 text-white/60 hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {alsoShowingMovies.map((m) => (
                <MovieCard key={m.id} movie={toTransformedMovie(m)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />

      {/* Trailer Modal */}
      {movie.trailerUrl && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          trailerUrl={movie.trailerUrl}
          movieTitle={movie.title}
        />
      )}
    </div>
  );
}
