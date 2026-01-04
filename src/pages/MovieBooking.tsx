import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Play, MapPin, Heart, Navigation, ChevronLeft, User, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MovieCard } from "@/components/MovieCard";
import { useDisplayLayout } from "@/hooks/use-display-layout";
import { useNowShowingMovies } from "@/hooks/use-movies";
import { formatRuntime, TransformedMovie } from "@/services/movie-service";

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
      date: date,
      month: monthNames[date.getMonth()],
      day: date.getDate().toString().padStart(2, '0'),
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()],
    });
  }
  
  return dates;
};

export default function MovieBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieRef = searchParams.get('movie') || '';
  
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const dates = useMemo(() => generateDates(), []);
  const selectedDate = dates[selectedDateIndex]?.date || new Date();

  // Fetch display layout from API
  const { movie, cinemas, isLoading, isError } = useDisplayLayout({
    movieRef,
    layoutId: "3",
    date: selectedDate,
    enabled: !!movieRef,
  });

  // Fetch now showing movies for "Also Showing" section
  const { movies: nowShowingMovies } = useNowShowingMovies(1, 6);
  
  // Filter out current movie from "Also Showing"
  const alsoShowingMovies = nowShowingMovies.filter(m => m.id !== movieRef);

  const handleTimeslotClick = (cinema: string, format: string, time: string, language: string, timeSlotId?: number) => {
    navigate(`/select-seats?movie=${movieRef}&cinema=${encodeURIComponent(cinema)}&time=${encodeURIComponent(time)}&format=${encodeURIComponent(format)}&language=${encodeURIComponent(language)}${timeSlotId ? `&timeSlotId=${timeSlotId}` : ''}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D14] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Error state
  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-[#0B0D14] flex flex-col items-center justify-center gap-4">
        <p className="text-white/70">Failed to load movie details</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
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
          className="absolute inset-0 h-[350px]"
          style={{
            backgroundImage: movie.backdrop_url ? `url(${movie.backdrop_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14] via-[#0B0D14]/80 to-[#0B0D14]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 pt-8 pb-6">
          <div className="flex gap-6 items-start">
            {/* Poster */}
            <div className="relative shrink-0 group">
              <img 
                src={movie.poster_url || ''} 
                alt={movie.title}
                className="w-36 md:w-44 h-auto rounded-lg shadow-2xl object-cover aspect-[2/3]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>
            
            {/* Movie Info */}
            <div className="flex-1 pt-4">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 uppercase tracking-wide">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mb-4">
                <Badge variant="outline" className="border-white/30 text-white bg-white/5">
                  {movie.certificate || 'U'}
                </Badge>
                <span>{formatRuntime(movie.runtime)}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.release_date}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.genres?.join(', ')}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.language}</span>
              </div>
              
              {movie.is_live && (
                <Badge className="bg-primary text-white hover:bg-primary/90 mb-4">
                  LIVE
                </Badge>
              )}
              
              <button className="block text-primary hover:underline text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Date Picker */}
      <section className="bg-[#0B0D14] border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date, index) => (
              <button
                key={date.id}
                onClick={() => setSelectedDateIndex(index)}
                className={cn(
                  "flex flex-col items-center px-4 py-3 rounded-lg min-w-[80px] transition-all",
                  selectedDateIndex === index 
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
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gray-500" />
              Lapsed
            </span>
            <span className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-white/30">
                Subtitle
              </Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Cinema Listings */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          {cinemas.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No showtimes available for this date
            </div>
          ) : (
            cinemas.map((cinema) => (
              <div key={cinema.id} className="bg-[#1A1D25] border border-white/10 rounded-xl overflow-hidden mb-6">
                {/* Cinema Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-white">{cinema.name}</h3>
                    <p className="text-xs text-white/50">{cinema.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {cinema.distance && (
                      <span className="text-xs text-white/50">{cinema.distance}</span>
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
                  {cinema.formats.map((format) => (
                    <div key={format.name}>
                      <h4 className="text-xs font-bold text-white/70 mb-3">{format.name}</h4>
                      <div className="flex flex-wrap gap-3">
                        {format.showtimes.map((showtime, idx) => (
                          <button
                            key={idx}
                            onClick={() => showtime.available && handleTimeslotClick(cinema.name, format.name, showtime.time, showtime.language, showtime.id)}
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
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Also Showing Section */}
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
            {alsoShowingMovies.slice(0, 5).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
