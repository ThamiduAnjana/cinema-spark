import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, MapPin, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nowShowingMovies, featuredMovie } from "@/data/movies";
import { ThemeToggle } from "@/components/ThemeToggle";

// Seat configuration
interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "occupied" | "selected";
  section: "classic" | "prime" | "superior";
}

// Cinema showtimes data
const showtimeData = [
  { time: "02:15 PM", language: "English", format: "3D, LUXE" },
  { time: "02:30 PM", language: "English", format: "3D" },
  { time: "04:35 PM", language: "English", format: "3D" },
  { time: "06:15 PM", language: "English", format: "3D, LUXE" },
  { time: "06:30 PM", language: "English", format: "3D" },
  { time: "07:00 PM", language: "English", format: "3D" },
  { time: "10:05 PM", language: "English", format: "3D, LUXE" },
  { time: "10:30 PM", language: "English", format: "3D" },
  { time: "10:35 PM", language: "English", format: "3D" },
  { time: "10:45 PM", language: "Tamil", format: "LUXE" },
];

// Seat prices per section
const sectionPrices: Record<string, number> = {
  classic: 1500,
  prime: 1500,
  superior: 1500,
};

// Generate initial seat map
const generateSeatMap = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L"];
  const seatsPerRow = 13;
  
  // Randomly mark some seats as occupied
  const occupiedSeats = new Set([
    "A11", "B11", "B9", "C11", "C4", "C1",
    "D11", "D9", "E9", "F11", "G11", "H11", "H9", "H3", "H2",
    "J11", "J9", "K11", "K9"
  ]);

  rows.forEach((row, rowIndex) => {
    let section: "classic" | "prime" | "superior";
    if (rowIndex < 3) section = "classic";
    else if (rowIndex < 8) section = "prime";
    else section = "superior";

    for (let i = 1; i <= seatsPerRow; i++) {
      const seatId = `${row}${i}`;
      seats.push({
        id: seatId,
        row,
        number: i,
        status: occupiedSeats.has(seatId) ? "occupied" : "available",
        section,
      });
    }
  });

  return seats;
};

// Generate dates
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    dates.push({
      id: i.toString(),
      day: date.getDate(),
      month: monthNames[date.getMonth()],
      dayName: dayNames[date.getDay()],
      fullDate: `${date.getDate()} ${monthNames[date.getMonth()]}, ${dayNames[date.getDay()]}`,
    });
  }
  
  return dates;
};

export default function SeatSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const movieId = searchParams.get('movie') || '1';
  const cinemaName = searchParams.get('cinema') || 'SAS Plaza Cinemas';
  const initialTime = searchParams.get('time') || '07:00 PM';
  const format = searchParams.get('format') || '3D';
  
  const [seats, setSeats] = useState<Seat[]>(generateSeatMap);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [dates] = useState(generateDates);
  const [selectedDateIndex] = useState(0);
  
  // Find the movie from our data
  const movie = movieId === '1' ? featuredMovie : nowShowingMovies.find(m => m.id === movieId) || featuredMovie;
  
  // Get selected seats
  const selectedSeats = useMemo(() => 
    seats.filter(seat => seat.status === "selected"), 
    [seats]
  );
  
  // Calculate totals
  const ticketTotal = useMemo(() => 
    selectedSeats.reduce((sum, seat) => sum + sectionPrices[seat.section], 0),
    [selectedSeats]
  );
  
  // Handle seat click
  const handleSeatClick = (seatId: string) => {
    setSeats(prev => prev.map(seat => {
      if (seat.id === seatId && seat.status !== "occupied") {
        return {
          ...seat,
          status: seat.status === "selected" ? "available" : "selected"
        };
      }
      return seat;
    }));
  };
  
  // Group seats by section and row
  const seatsBySection = useMemo(() => {
    const grouped: Record<string, Record<string, Seat[]>> = {
      classic: {},
      prime: {},
      superior: {},
    };
    
    seats.forEach(seat => {
      if (!grouped[seat.section][seat.row]) {
        grouped[seat.section][seat.row] = [];
      }
      grouped[seat.section][seat.row].push(seat);
    });
    
    return grouped;
  }, [seats]);

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    // Navigate to payment (placeholder)
    alert(`Proceeding to payment for ${selectedSeats.length} seats: ${selectedSeats.map(s => s.id).join(", ")}\nTotal: LKR ${ticketTotal.toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#0B0D14] border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            {/* Left: Back + Breadcrumb */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate(`/movie-booking?movie=${movieId}`)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">BACK</span>
              </button>
              
              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center gap-3 text-sm">
                <span className="text-white/40">CHOOSE CINEMA</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
                <span className="text-primary font-medium border-b-2 border-primary pb-1">SELECT SEATS</span>
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
        
        {/* Time Selector */}
        <div className="bg-[#1A1D25] border-b border-white/10 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center gap-2 text-white shrink-0">
                <span className="font-medium">{dates[selectedDateIndex].fullDate}</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
              
              <div className="flex gap-3">
                {showtimeData.map((showtime, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTime(showtime.time)}
                    className={cn(
                      "flex flex-col items-center px-3 py-1 min-w-[80px] transition-all border-b-2",
                      selectedTime === showtime.time 
                        ? "border-primary" 
                        : "border-transparent hover:border-white/30"
                    )}
                  >
                    <span className="text-[10px] text-white/50">{showtime.language}</span>
                    <span className={cn(
                      "text-sm",
                      selectedTime === showtime.time ? "font-bold text-white" : "text-white/70"
                    )}>
                      {showtime.time}
                    </span>
                    <span className="text-[10px] text-white/40">{showtime.format}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Seat Map */}
        <div className="flex-1 overflow-auto py-6">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Screen */}
            <div className="text-center mb-8">
              <div className="text-sm text-white/50 mb-2">SCREEN</div>
              <div className="relative">
                <svg viewBox="0 0 400 40" className="w-full max-w-xl mx-auto h-10">
                  <path 
                    d="M 20 35 Q 200 0 380 35" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white/40 bg-transparent rounded-sm" />
                <span className="text-white/70">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-sm" />
                <span className="text-white/70">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-sm" />
                <span className="text-white/70">Occupied</span>
              </div>
            </div>
            
            {/* Seat Sections */}
            <div className="space-y-8">
              {/* Classic Section */}
              <div>
                <div className="text-center mb-4">
                  <span className="font-bold text-white">CLASSIC FULL</span>
                  <span className="text-white/50 ml-2">(LKR {sectionPrices.classic.toFixed(2)})</span>
                </div>
                {Object.entries(seatsBySection.classic).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-6 text-center text-sm font-medium text-white/50">{row}</span>
                    <div className="flex gap-1">
                      {rowSeats.sort((a, b) => b.number - a.number).map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === "occupied"}
                          className={cn(
                            "w-7 h-7 text-xs font-medium rounded-sm transition-all",
                            seat.status === "available" && "bg-transparent border-2 border-white/40 hover:border-primary text-white/70",
                            seat.status === "selected" && "bg-primary border-2 border-primary text-white",
                            seat.status === "occupied" && "bg-white/20 text-white/30 cursor-not-allowed"
                          )}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <span className="w-6 text-center text-sm font-medium text-white/50">{row}</span>
                  </div>
                ))}
              </div>
              
              {/* Prime Section */}
              <div>
                <div className="text-center mb-4">
                  <span className="font-bold text-white">PRIME FULL</span>
                  <span className="text-white/50 ml-2">(LKR {sectionPrices.prime.toFixed(2)})</span>
                </div>
                {Object.entries(seatsBySection.prime).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-6 text-center text-sm font-medium text-white/50">{row}</span>
                    <div className="flex gap-1">
                      {rowSeats.sort((a, b) => b.number - a.number).map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === "occupied"}
                          className={cn(
                            "w-7 h-7 text-xs font-medium rounded-sm transition-all",
                            seat.status === "available" && "bg-transparent border-2 border-white/40 hover:border-primary text-white/70",
                            seat.status === "selected" && "bg-primary border-2 border-primary text-white",
                            seat.status === "occupied" && "bg-white/20 text-white/30 cursor-not-allowed"
                          )}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <span className="w-6 text-center text-sm font-medium text-white/50">{row}</span>
                  </div>
                ))}
              </div>
              
              {/* Superior Section */}
              <div>
                <div className="text-center mb-4">
                  <span className="font-bold text-white">SUPERIOR FULL</span>
                  <span className="text-white/50 ml-2">(LKR {sectionPrices.superior.toFixed(2)})</span>
                </div>
                {Object.entries(seatsBySection.superior).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-6 text-center text-sm font-medium text-white/50">{row}</span>
                    <div className="flex gap-1">
                      {rowSeats.sort((a, b) => b.number - a.number).map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === "occupied"}
                          className={cn(
                            "w-7 h-7 text-xs font-medium rounded-sm transition-all",
                            seat.status === "available" && "bg-transparent border-2 border-white/40 hover:border-primary text-white/70",
                            seat.status === "selected" && "bg-primary border-2 border-primary text-white",
                            seat.status === "occupied" && "bg-white/20 text-white/30 cursor-not-allowed"
                          )}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <span className="w-6 text-center text-sm font-medium text-white/50">{row}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Summary Sidebar */}
      <div className="w-80 bg-[#0B0D14] border-l border-white/10 text-white flex flex-col shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-primary">Booking Summary</h2>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          {/* Movie Info */}
          <div className="flex gap-3 mb-6">
            <img 
              src={movie.poster} 
              alt={movie.title}
              className="w-16 h-24 object-cover rounded-lg border border-white/10"
            />
            <div className="flex-1">
              <h3 className="font-bold text-sm uppercase text-white">{movie.title}</h3>
              <p className="text-xs text-white/60 mt-1">
                (U) • {movie.genre.join(' • ')} • {movie.language}
              </p>
              <p className="text-xs text-white/80 mt-2">
                {dates[selectedDateIndex].dayName.slice(0, 3)}, {dates[selectedDateIndex].day} {dates[selectedDateIndex].month}, {selectedTime}
              </p>
              <p className="text-xs text-white/50 mt-1">{cinemaName}</p>
            </div>
          </div>
          
          {/* Seat Info */}
          {selectedSeats.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs text-white/50 mb-2">SEAT INFO</h4>
              <p className="text-sm font-medium text-primary mb-2">
                {selectedSeats[0]?.section.toUpperCase()} FULL
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <span 
                    key={seat.id}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm font-medium"
                  >
                    {seat.id}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Tickets */}
          {selectedSeats.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs text-white/50 mb-2">TICKETS</h4>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">{selectedSeats.length} x {sectionPrices[selectedSeats[0]?.section || 'classic']}</span>
                <span className="text-white">LKR {ticketTotal.toLocaleString()}.00</span>
              </div>
            </div>
          )}
          
          {/* Payment Details */}
          {selectedSeats.length > 0 && (
            <div>
              <h4 className="text-xs text-white/50 mb-2">PAYMENT DETAILS</h4>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Sub Total</span>
                <span className="text-white">LKR {ticketTotal.toLocaleString()}.00</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex justify-between mb-4">
            <span className="font-bold text-white">Grand Total</span>
            <span className="font-bold text-primary">LKR {ticketTotal.toLocaleString()}.00</span>
          </div>
          <Button 
            onClick={handleProceed}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3"
            disabled={selectedSeats.length === 0}
          >
            Proceed
          </Button>
        </div>
      </div>
      
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0B0D14] border-t border-white/10 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
            </p>
            <p className="font-bold text-primary">LKR {ticketTotal.toLocaleString()}.00</p>
          </div>
          <Button 
            onClick={handleProceed}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8"
            disabled={selectedSeats.length === 0}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
