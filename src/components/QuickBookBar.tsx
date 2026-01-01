import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nowShowingMovies, cinemas, timings } from "@/data/movies";
import { addDays, format } from "date-fns";

const dates = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(new Date(), i);
  return {
    value: format(date, "yyyy-MM-dd"),
    label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(date, "EEE, MMM d"),
  };
});

interface QuickBookBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function QuickBookBar({ activeTab, onTabChange }: QuickBookBarProps) {
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const tabs = [
    { id: "now-showing", label: "Now Showing" },
    { id: "coming-soon", label: "Coming Soon" },
    { id: "trailers", label: "Trailers" },
  ];

  return (
    <div className="bg-primary py-4">
      <div className="container mx-auto px-4">
        {/* Booking Dropdowns */}
        <div className="flex flex-col lg:flex-row items-stretch gap-3 mb-4">
          <Select value={selectedMovie} onValueChange={setSelectedMovie}>
            <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-primary-foreground">
              <SelectValue placeholder="Select Movie" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {nowShowingMovies.map((movie) => (
                <SelectItem key={movie.id} value={movie.id}>
                  {movie.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-primary-foreground">
              <SelectValue placeholder="Select Date" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {dates.map((date) => (
                <SelectItem key={date.value} value={date.value}>
                  {date.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCinema} onValueChange={setSelectedCinema}>
            <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-primary-foreground">
              <SelectValue placeholder="Select Cinema" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {cinemas.map((cinema) => (
                <SelectItem key={cinema} value={cinema}>
                  {cinema}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-primary-foreground">
              <SelectValue placeholder="Select Timing" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {timings.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="bg-hero text-hero-foreground hover:bg-hero/90 font-semibold px-8"
          >
            Book Now
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              onClick={() => onTabChange(tab.id)}
              className={
                activeTab === tab.id
                  ? "bg-white text-hero font-semibold"
                  : "text-primary-foreground hover:bg-white/10"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
