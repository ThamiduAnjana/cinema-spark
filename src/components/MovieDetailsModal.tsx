import { useEffect, useRef } from "react";
import { X, Star, Clock, Calendar, Globe } from "lucide-react";
import { Movie } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

// Extended movie data with cast, crew, and backdrops
interface ExtendedMovie extends Movie {
  cast?: { name: string; image: string; role?: string }[];
  crew?: { name: string; image: string; role: string }[];
  backdrops?: string[];
}

// Demo cast and crew data
const demoCast = [
  { name: "Tom Holland", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", role: "Lead Actor" },
  { name: "Zendaya", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", role: "Lead Actress" },
  { name: "Jacob Batalon", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", role: "Supporting" },
  { name: "Marisa Tomei", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", role: "Supporting" },
  { name: "Benedict Wong", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", role: "Guest" },
  { name: "Jamie Foxx", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", role: "Villain" },
];

const demoCrew = [
  { name: "Jon Watts", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face", role: "Director" },
  { name: "Kevin Feige", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face", role: "Producer" },
  { name: "Amy Pascal", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", role: "Producer" },
  { name: "Michael Giacchino", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face", role: "Music" },
];

const demoBackdrops = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop",
];

export function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Extend movie with demo data
  const extendedMovie: ExtendedMovie | null = movie ? {
    ...movie,
    cast: demoCast,
    crew: demoCrew,
    backdrops: demoBackdrops,
  } : null;

  // Handle ESC key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !extendedMovie) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={handleBackdropClick}
    >
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Modal container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[1100px] max-h-[90vh] bg-[#FFF3DC] rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        style={{ animationDuration: "0.3s" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <ScrollArea className="h-[90vh]">
          <div className="p-0">
            {/* Header with backdrop */}
            <div
              className="relative h-[280px] md:h-[320px] bg-cover bg-center"
              style={{ backgroundImage: `url(${extendedMovie.backdrop})` }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF3DC] via-[#FFF3DC]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

              {/* Header content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                  {/* Poster */}
                  <div className="hidden md:block w-32 lg:w-40 flex-shrink-0">
                    <img
                      src={extendedMovie.poster}
                      alt={extendedMovie.title}
                      className="w-full aspect-[2/3] object-cover rounded-lg shadow-xl"
                    />
                  </div>

                  {/* Title and meta */}
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg mb-3">
                      {extendedMovie.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90 text-sm">
                      {extendedMovie.rating > 0 && (
                        <div className="flex items-center gap-1 bg-primary/90 px-2 py-1 rounded">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-semibold">{extendedMovie.rating}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{extendedMovie.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{extendedMovie.releaseDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{extendedMovie.language}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {extendedMovie.genre.map((g) => (
                        <span
                          key={g}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content sections */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Synopsis */}
              <section className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Synopsis</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {extendedMovie.description}
                  </p>
                </div>
                <div className="md:w-48 flex-shrink-0">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Book Now
                  </Button>
                </div>
              </section>

              {/* Cast */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
                  {extendedMovie.cast?.map((actor, index) => (
                    <div key={index} className="flex-shrink-0 text-center w-20">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden ring-2 ring-primary/20">
                        <img
                          src={actor.image}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-900 line-clamp-2">
                        {actor.name}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Crew */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Crew</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {extendedMovie.crew?.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Backdrops */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {extendedMovie.backdrops?.map((backdrop, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={backdrop}
                        alt={`Scene ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Mobile sticky Book Now */}
            <div className="md:hidden sticky bottom-0 p-4 bg-[#FFF3DC] border-t border-gray-200">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg">
                Book Now
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
