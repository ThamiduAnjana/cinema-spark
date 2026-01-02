import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Play, MapPin, Heart, Navigation, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { nowShowingMovies, featuredMovie } from "@/data/movies";
import sasPlazaLogo from "@/assets/sas-plaza-logo.jpg";

// Cinema data with showtimes
const cinemaData = [
  {
    id: "1",
    name: "SAS Plaza Cinemas",
    address: "SAS Plaza Mall, Trincomalee, Sri Lanka",
    distance: "2.5 km away",
    formats: [
      {
        name: "Standard",
        showtimes: [
          { time: "07:00 PM", language: "ENGLISH", available: true },
          { time: "10:45 PM", language: "TAMIL", available: true, fillingFast: true },
        ]
      },
      {
        name: "[ATMOS]",
        showtimes: [
          { time: "02:30 PM", language: "ENGLISH -3D", available: true },
          { time: "04:35 PM", language: "ENGLISH", available: true },
          { time: "06:30 PM", language: "ENGLISH -3D", available: true, fillingFast: true },
          { time: "10:30 PM", language: "ENGLISH -3D", available: false },
        ]
      },
      {
        name: "LUXE",
        showtimes: [
          { time: "02:15 PM", language: "ENGLISH -3D", available: true },
          { time: "06:15 PM", language: "ENGLISH -3D", available: true },
          { time: "10:05 PM", language: "ENGLISH -3D", available: true },
          { time: "10:35 PM", language: "ENGLISH", available: true },
        ]
      }
    ]
  }
];

// Also showing movies
const alsoShowingMovies = [
  { id: "as1", title: "SIRAI", genre: "DRAMA", language: "Tamil", rating: "U", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop" },
  { id: "as2", title: "THE SPONGEBOB MOVIE: SEARCH...", genre: "ANIMATION", language: "English", rating: "U", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop" },
  { id: "as3", title: "THE HOUSEMAID", genre: "THRILLER", language: "English", rating: "X", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop" },
  { id: "as4", title: "MALAKI DUWE NUMBA", genre: "DRAMA", language: "Sinhala", rating: "U", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop" },
  { id: "as5", title: "CYANIDE", genre: "DRAMA", language: "Sinhala", rating: "U", poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop" },
];

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

export default function MovieBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get('movie') || '1';
  
  const [selectedDate, setSelectedDate] = useState("0");
  const [dates] = useState(generateDates);
  
  // Find the movie from our data
  const movie = movieId === '1' ? featuredMovie : nowShowingMovies.find(m => m.id === movieId) || featuredMovie;

  const handleTimeslotClick = (cinema: string, format: string, time: string, language: string) => {
    console.log(`Selected: ${cinema} - ${format} - ${time} - ${language}`);
    // Navigate to seat selection (placeholder for now)
    alert(`Booking ${movie.title} at ${time} (${language}) - ${format}\nCinema: ${cinema}\n\nSeat selection coming soon!`);
  };

  return (
    <div className="min-h-screen bg-[#0B0D14]">
      {/* Header */}
      <header className="bg-[#0B0D14] border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={sasPlazaLogo} 
              alt="SAS Plaza" 
              className="h-10 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
          
          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-amber-500 font-medium">CHOOSE CINEMA</span>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white/40">SELECT SEATS</span>
            <ChevronRight className="w-4 h-4 text-white/40" />
            <span className="text-white/40">PAYMENT</span>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span>Trincomalee</span>
            </div>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
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
            backgroundImage: `url(${movie.backdrop})`,
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
                src={movie.poster} 
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
                  U
                </Badge>
                <span>{movie.duration}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.releaseDate}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.genre.join(', ')}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.language}</span>
              </div>
              
              <Badge className="bg-amber-600 text-white hover:bg-amber-700 mb-4">
                LIVE
              </Badge>
              
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
            {dates.map((date) => (
              <button
                key={date.id}
                onClick={() => setSelectedDate(date.id)}
                className={cn(
                  "flex flex-col items-center px-4 py-3 rounded-lg min-w-[80px] transition-all",
                  selectedDate === date.id 
                    ? "bg-amber-500 text-black" 
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
              <span className="w-3 h-3 rounded-sm bg-amber-500" />
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
          {cinemaData.map((cinema) => (
            <div key={cinema.id} className="bg-[#FFF8E7] rounded-xl overflow-hidden mb-6">
              {/* Cinema Header */}
              <div className="flex items-center justify-between p-4 border-b border-amber-200/50">
                <div>
                  <h3 className="font-bold text-gray-900">{cinema.name}</h3>
                  <p className="text-xs text-gray-500">{cinema.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{cinema.distance}</span>
                  <button className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                    <Navigation className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                    <Heart className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Showtimes */}
              <div className="p-4 space-y-6">
                {cinema.formats.map((format) => (
                  <div key={format.name}>
                    <h4 className="text-xs font-bold text-gray-600 mb-3">{format.name}</h4>
                    <div className="flex flex-wrap gap-3">
                      {format.showtimes.map((showtime, idx) => (
                        <button
                          key={idx}
                          onClick={() => showtime.available && handleTimeslotClick(cinema.name, format.name, showtime.time, showtime.language)}
                          disabled={!showtime.available}
                          className={cn(
                            "flex flex-col items-center px-4 py-2 rounded-lg border-2 min-w-[100px] transition-all",
                            showtime.available 
                              ? showtime.fillingFast
                                ? "border-amber-500 bg-amber-50 hover:bg-amber-100 cursor-pointer"
                                : "border-green-500 bg-green-50 hover:bg-green-100 cursor-pointer"
                              : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                          )}
                        >
                          <span className="text-[10px] text-gray-600 font-medium">{showtime.language}</span>
                          <span className={cn(
                            "text-sm font-bold",
                            showtime.available 
                              ? showtime.fillingFast ? "text-amber-600" : "text-green-600"
                              : "text-gray-400"
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
          ))}
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
            {alsoShowingMovies.map((movie) => (
              <div key={movie.id} className="group cursor-pointer">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-white text-sm line-clamp-1">{movie.title}</h3>
                <p className="text-xs text-white/60">
                  ({movie.rating}) • {movie.genre}
                </p>
                <p className="text-xs text-primary">{movie.language}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0D14] border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Security Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="px-2 py-1 border border-white/20 rounded">PCI DSS CERTIFIED</span>
                <span className="px-2 py-1 border border-white/20 rounded">Norton SECURED</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
            
            {/* App Store Badges */}
            <div className="flex items-center gap-3">
              <a href="#" className="block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
              </a>
              <a href="#" className="block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">© 2026 All rights reserved</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Feedback</a>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
