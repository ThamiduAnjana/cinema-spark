import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface TrailerModalProps {
  trailerUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
  movieTitle?: string;
}

// Helper to extract YouTube video ID and convert to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const regexPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`;
    }
  }
  
  // If already an embed URL, just add autoplay
  if (url.includes("youtube.com/embed/")) {
    return url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
  }
  
  return null;
}

export function TrailerModal({ trailerUrl, isOpen, onClose, movieTitle }: TrailerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !trailerUrl) return null;

  const embedUrl = getYouTubeEmbedUrl(trailerUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" />

      {/* Modal container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl animate-scale-in"
        style={{ animationDuration: "0.3s" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close trailer"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Title */}
        {movieTitle && (
          <h3 className="absolute -top-12 left-0 text-white text-lg font-semibold truncate max-w-[calc(100%-60px)]">
            {movieTitle} - Trailer
          </h3>
        )}

        {/* Video container */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
          <iframe
            src={embedUrl}
            title={movieTitle ? `${movieTitle} Trailer` : "Movie Trailer"}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
