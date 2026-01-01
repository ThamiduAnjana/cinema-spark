import { useState } from "react";
import { Search, MapPin, User, Menu, X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";

const cities = ["Colombo", "Kandy", "Galle", "Negombo", "Jaffna"];

export function Header() {
  const [selectedCity, setSelectedCity] = useState("Colombo");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full bg-hero border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-hero-foreground hidden sm:block">
              CinePlex
            </span>
          </a>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-hero-foreground placeholder:text-white/50 focus:bg-white/20"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* City Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-hero-foreground hover:bg-white/10 gap-1"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">{selectedCity}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className="cursor-pointer"
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Login Button - Desktop */}
            <Button
              variant="outline"
              className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-hero-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-hero-foreground placeholder:text-white/50"
                />
              </div>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
