import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, MapPin, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nowShowingMovies, featuredMovie } from "@/data/movies";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// JSON API Response structure
interface Section {
  section_id: number;
  section_name: string;
  price: number;
  color: string;
}

interface SeatData {
  seat_id: number;
  row_label: string;
  seat_number: number;
  column_position: number;
  status: "available" | "occupied" | "selected";
  section: Section;
}

interface LayoutData {
  total_rows: number;
  total_seats: number;
}

interface SeatLayoutResponse {
  layout: LayoutData;
  seats: SeatData[];
}

// Mock JSON API Response - VVIP and VIP sections (based on image reference)
const seatLayoutApiResponse: SeatLayoutResponse = {
  layout: {
    total_rows: 12,
    total_seats: 144,
  },
  seats: generateMockSeats(),
};

function generateMockSeats(): SeatData[] {
  const seats: SeatData[] = [];
  const sections: Record<string, Section> = {
    VVIP: { section_id: 1, section_name: "VVIP", price: 3200.00, color: "#4A0E63" },
    VIP: { section_id: 2, section_name: "VIP", price: 2400.00, color: "#EFBF04" },
  };
  
  // VVIP rows (A, B) - bottom rows closest to screen
  const vvipRows = ["A", "B"];
  // VIP rows (C, D, E, F, G, H, I, J, K, L)
  const vipRows = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  
  // Occupied seats set
  const occupiedSeats = new Set([
    "A2", "A3", "A4", "A7", "A8", "B2", "B3", "B4", "B6", "B7", "B8",
    "C3", "C4", "D3", "D4", "E5", "F6", "G3", "H4", "I2", "J5", "K6", "L3"
  ]);
  
  let seatId = 1;
  
  // Generate VVIP seats (rows A and B - fewer seats, centered)
  vvipRows.forEach((row) => {
    const seatsPerRow = 8;
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatKey = `${row}${i}`;
      // Add center aisle gap after seat 4
      const columnPos = i <= 4 ? i + 2 : i + 3;
      seats.push({
        seat_id: seatId++,
        row_label: row,
        seat_number: i,
        column_position: columnPos,
        status: occupiedSeats.has(seatKey) ? "occupied" : "available",
        section: sections.VVIP,
      });
    }
  });
  
  // Generate VIP seats (rows C has 10 seats, D-L have 12 seats)
  vipRows.forEach((row) => {
    const seatsPerRow = row === "C" ? 10 : 12;
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatKey = `${row}${i}`;
      // Add center aisle gap after seat 5 or 6 depending on row size
      const midPoint = row === "C" ? 4 : 5;
      const columnPos = i <= midPoint ? i : i + 1;
      seats.push({
        seat_id: seatId++,
        row_label: row,
        seat_number: i,
        column_position: columnPos,
        status: occupiedSeats.has(seatKey) ? "occupied" : "available",
        section: sections.VIP,
      });
    }
  });
  
  return seats;
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
  
  const [seats, setSeats] = useState<SeatData[]>(seatLayoutApiResponse.seats);
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
    selectedSeats.reduce((sum, seat) => sum + seat.section.price, 0),
    [selectedSeats]
  );
  
  // Handle seat click
  const handleSeatClick = (seatId: number) => {
    setSeats(prev => prev.map(seat => {
      if (seat.seat_id === seatId && seat.status !== "occupied") {
        return {
          ...seat,
          status: seat.status === "selected" ? "available" : "selected"
        };
      }
      return seat;
    }));
  };
  
  // Group seats by row (reversed order - L to A from top to bottom)
  const seatsByRow = useMemo(() => {
    const grouped: Record<string, { seats: SeatData[]; section: Section }> = {};
    
    seats.forEach(seat => {
      if (!grouped[seat.row_label]) {
        grouped[seat.row_label] = { seats: [], section: seat.section };
      }
      grouped[seat.row_label].seats.push(seat);
    });
    
    // Sort seats within each row by seat_number
    Object.values(grouped).forEach(({ seats: rowSeats }) => {
      rowSeats.sort((a, b) => a.seat_number - b.seat_number);
    });
    
    return grouped;
  }, [seats]);

  // Get row order (L to A - top to bottom)
  const rowOrder = useMemo(() => {
    return Object.keys(seatsByRow).sort((a, b) => b.localeCompare(a));
  }, [seatsByRow]);

  // Render individual seat with price
  const renderSeat = (seat: SeatData) => {
    const seatLabel = `${seat.row_label}${seat.seat_number}`;
    const isVVIP = seat.section.section_name === "VVIP";
    
    return (
      <TooltipProvider key={seat.seat_id}>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleSeatClick(seat.seat_id)}
              disabled={seat.status === "occupied"}
              className={cn(
                "w-12 h-14 md:w-14 md:h-16 text-xs font-bold rounded-md transition-all flex flex-col items-center justify-center gap-0.5",
                seat.status === "available" && isVVIP && "bg-[#4A0E63] text-white hover:opacity-80",
                seat.status === "available" && !isVVIP && "bg-[#EFBF04] text-gray-900 hover:opacity-80",
                seat.status === "selected" && "bg-[#1e40af] text-white ring-2 ring-white",
                seat.status === "occupied" && "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              )}
            >
              <span className="text-[10px] md:text-xs font-bold">{seatLabel}</span>
              <span className="text-[8px] md:text-[10px] opacity-80">
                {seat.section.price.toLocaleString()}
              </span>
            </button>
          </TooltipTrigger>
          {seat.status !== "occupied" && (
            <TooltipContent 
              className="bg-[#1A1D25] border-white/20 text-white"
              side="top"
            >
              <div className="text-center">
                <p className="font-bold">{seatLabel}</p>
                <p className="text-xs text-white/70">
                  {seat.section.section_name} - LKR {seat.section.price.toLocaleString()}
                </p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Render seats with center aisle
  const renderSeatsWithAisle = (rowSeats: SeatData[]) => {
    const midPoint = Math.ceil(rowSeats.length / 2);
    const leftSeats = rowSeats.slice(0, midPoint);
    const rightSeats = rowSeats.slice(midPoint);
    
    return (
      <div className="flex items-center justify-center gap-1 md:gap-1.5">
        {/* Left section */}
        <div className="flex gap-1 md:gap-1.5">
          {leftSeats.map(seat => renderSeat(seat))}
        </div>
        
        {/* Center aisle */}
        <div className="w-6 md:w-10" />
        
        {/* Right section */}
        <div className="flex gap-1 md:gap-1.5">
          {rightSeats.map(seat => renderSeat(seat))}
        </div>
      </div>
    );
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    alert(`Proceeding to payment for ${selectedSeats.length} seats: ${selectedSeats.map(s => `${s.row_label}${s.seat_number}`).join(", ")}\nTotal: LKR ${ticketTotal.toLocaleString()}`);
  };

  // Group selected seats by section for display
  const selectedSeatsBySection = useMemo(() => {
    const grouped: Record<string, { section: Section; seats: SeatData[] }> = {};
    selectedSeats.forEach(seat => {
      const sectionName = seat.section.section_name;
      if (!grouped[sectionName]) {
        grouped[sectionName] = { section: seat.section, seats: [] };
      }
      grouped[sectionName].seats.push(seat);
    });
    return grouped;
  }, [selectedSeats]);

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
        <div className="flex-1 overflow-auto py-6 pb-32 lg:pb-6">
          <div className="container mx-auto px-4">
            {/* Screen */}
            <div className="text-center mb-8">
              <div className="relative max-w-3xl mx-auto">
                <div className="h-8 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent rounded-t-full" />
                <div className="text-sm text-white/70 font-medium tracking-[0.3em] mt-2 bg-[#1A1D25] inline-block px-8 py-1 rounded">
                  SCREEN
                </div>
              </div>
            </div>
            
            {/* Seat Grid - Rows L to A (top to bottom) */}
            <div className="space-y-2 max-w-5xl mx-auto overflow-x-auto">
              {rowOrder.map((rowLabel) => {
                const { seats: rowSeats, section } = seatsByRow[rowLabel];
                const isVVIP = section.section_name === "VVIP";
                
                return (
                  <div key={rowLabel} className="flex items-center gap-3 md:gap-4 min-w-max justify-center">
                    {/* Left Row Label */}
                    <span className={cn(
                      "w-8 text-center text-sm font-bold",
                      isVVIP ? "text-[#4A0E63]" : "text-[#EFBF04]"
                    )}>
                      {rowLabel}
                    </span>
                    
                    {/* Seats */}
                    {renderSeatsWithAisle(rowSeats)}
                    
                    {/* Right Row Label */}
                    <span className={cn(
                      "w-8 text-center text-sm font-bold",
                      isVVIP ? "text-[#4A0E63]" : "text-[#EFBF04]"
                    )}>
                      {rowLabel}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-8 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#4A0E63] rounded-md" />
                <span className="text-white/70">VVIP (3,200)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#EFBF04] rounded-md" />
                <span className="text-white/70">VIP (2,400)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1e40af] rounded-md" />
                <span className="text-white/70">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-600/50 rounded-md" />
                <span className="text-white/70">Occupied</span>
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
          
          {/* Seat Info by Section */}
          {Object.entries(selectedSeatsBySection).map(([sectionName, { section, seats: sectionSeats }]) => (
            <div key={sectionName} className="mb-6">
              <h4 className="text-xs text-white/50 mb-2">SEAT INFO</h4>
              <p 
                className="text-sm font-medium mb-2"
                style={{ color: section.color }}
              >
                {section.section_name} - LKR {section.price.toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2">
                {sectionSeats.map(seat => (
                  <span 
                    key={seat.seat_id}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm font-medium"
                  >
                    {seat.row_label}{seat.seat_number}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          {/* Tickets */}
          {selectedSeats.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs text-white/50 mb-2">TICKETS</h4>
              {Object.entries(selectedSeatsBySection).map(([sectionName, { section, seats: sectionSeats }]) => (
                <div key={sectionName} className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">{sectionSeats.length} x {section.price.toLocaleString()}</span>
                  <span className="text-white">LKR {(sectionSeats.length * section.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Payment Details */}
          {selectedSeats.length > 0 && (
            <div>
              <h4 className="text-xs text-white/50 mb-2">PAYMENT DETAILS</h4>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Sub Total</span>
                <span className="text-white">LKR {ticketTotal.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex justify-between mb-4">
            <span className="font-bold text-white">Grand Total</span>
            <span className="font-bold text-primary">LKR {ticketTotal.toLocaleString()}</span>
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
            <p className="font-bold text-primary">LKR {ticketTotal.toLocaleString()}</p>
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
