import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Star, Clock, Calendar, Globe, Play, Film, CalendarClock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransformedMovie } from "@/services/movie-service";
import { TMDB_IMAGE_BASE } from "@/lib/api-config";
import { TrailerModal } from "./TrailerModal";

interface MovieDetailsModalProps {
  movie: TransformedMovie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Handle ESC key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isTrailerOpen) {
          setIsTrailerOpen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, isTrailerOpen]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !movie) return null;

  // Helper to get profile image URL
  const getProfileImage = (profilePath: string | null) => {
    if (!profilePath) return "/placeholder.svg";
    if (profilePath.startsWith("http")) return profilePath;
    return `${TMDB_IMAGE_BASE}${profilePath}`;
  };

  // Filter crew by known departments
  const getCrewByDepartment = () => {
    if (!movie.crew || movie.crew.length === 0) return [];
    
    const departments = ["Directing", "Production", "Writing", "Sound", "Camera"];
    return movie.crew.filter((member) =>
      departments.some((dept) => member.department?.includes(dept))
    );
  };

  const displayedCrew = getCrewByDepartment().slice(0, 4);
  const isUpcoming = movie.movieType === "upcoming";

  return (
    <>
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
                style={{ backgroundImage: `url(${movie.backdrop})` }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFF3DC] via-[#FFF3DC]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                {/* Header content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                    {/* Poster */}
                    <div className="hidden md:block w-32 lg:w-40 flex-shrink-0 relative group">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg shadow-xl"
                      />
                      {/* Play trailer overlay on poster */}
                      {movie.trailerUrl && (
                        <button
                          onClick={() => setIsTrailerOpen(true)}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Title and meta */}
                    <div className="flex-1">
                      {/* Movie Type Badge */}
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold mb-2 ${
                        isUpcoming 
                          ? "bg-amber-500 text-black" 
                          : "bg-green-600 text-white"
                      }`}>
                        {isUpcoming ? (
                          <>
                            <CalendarClock className="w-3 h-3" />
                            Upcoming
                          </>
                        ) : (
                          <>
                            <Film className="w-3 h-3" />
                            Now Showing
                          </>
                        )}
                      </div>
                      
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg mb-1">
                        {movie.title}
                      </h1>
                      {movie.tagline && (
                        <p className="text-white/70 text-sm italic mb-3">{movie.tagline}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90 text-sm">
                        {movie.rating > 0 && (
                          <div className="flex items-center gap-1 bg-primary/90 px-2 py-1 rounded">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{movie.rating}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{movie.runtime}</span>
                        </div>
                        {movie.releaseDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{movie.releaseDate}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <span>{movie.language}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {movie.genres.map((g) => (
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
                {/* Synopsis and Actions */}
                <section className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Synopsis</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {movie.description || "No synopsis available."}
                    </p>
                  </div>
                  <div className="md:w-48 flex-shrink-0 space-y-3">
                    <Button
                      onClick={() => {
                        onClose();
                        const movieRef = (movie as any).ref || movie.id;
                        navigate(`/movie-booking/${movieRef}`);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      {isUpcoming ? "Notify Me" : "Book Now"}
                    </Button>
                    {movie.trailerUrl && (
                      <Button
                        onClick={() => setIsTrailerOpen(true)}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-6 rounded-lg transition-all gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Watch Trailer
                      </Button>
                    )}
                  </div>
                </section>

                {/* Production Companies */}
                {movie.productionCompanies && movie.productionCompanies.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Production Companies
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      {movie.productionCompanies.map((company) => (
                        <div 
                          key={company.id} 
                          className="flex items-center gap-3 bg-white/60 px-4 py-3 rounded-lg border border-gray-200"
                        >
                          {company.logo_path ? (
                            <img
                              src={`${TMDB_IMAGE_BASE}${company.logo_path}`}
                              alt={company.name}
                              className="h-8 w-auto max-w-[80px] object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                          )}
                          <span className="text-sm font-medium text-gray-800">{company.name}</span>
                          {company.origin_country && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {company.origin_country}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Cast */}
                {movie.cast && movie.cast.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Cast</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
                      {movie.cast.map((actor) => (
                        <div key={actor.id} className="flex-shrink-0 text-center w-20">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden ring-2 ring-primary/20 bg-muted">
                            <img
                              src={getProfileImage(actor.profile_path)}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <p className="text-xs font-medium text-gray-900 line-clamp-2">
                            {actor.name}
                          </p>
                          {actor.character && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {actor.character}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Crew */}
                {displayedCrew.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Crew</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {displayedCrew.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                            <img
                              src={getProfileImage(member.profile_path)}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500">{member.job}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Backdrops / Gallery */}
                {movie.galleryImages && movie.galleryImages.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {movie.galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                        >
                          <img
                            src={image}
                            alt={`Scene ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Show primary backdrop if no gallery */}
                {(!movie.galleryImages || movie.galleryImages.length === 0) && movie.backdrop && (
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Gallery</h2>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <img
                          src={movie.backdrop}
                          alt="Movie backdrop"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Mobile sticky Book Now */}
              <div className="md:hidden sticky bottom-0 p-4 bg-[#FFF3DC] border-t border-gray-200">
                <Button 
                  onClick={() => {
                    onClose();
                    const movieRef = (movie as any).ref || movie.id;
                    navigate(`/movie-booking/${movieRef}`);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg"
                >
                  {isUpcoming ? "Notify Me" : "Book Now"}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        trailerUrl={movie.trailerUrl}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        movieTitle={movie.title}
      />
    </>
  );
}
