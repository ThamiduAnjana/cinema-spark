export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  duration: string;
  releaseDate: string;
  genre: string[];
  language: string;
  rating: number;
  description: string;
  trailerUrl?: string;
}

export const featuredMovie: Movie = {
  id: "1",
  title: "AVATAR: FIRE AND ASH",
  poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
  backdrop: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",
  duration: "2h 45m",
  releaseDate: "Dec 20, 2024",
  genre: ["Sci-Fi", "Action", "Adventure"],
  language: "English",
  rating: 8.5,
  description: "Return to Pandora in this epic continuation of the Avatar saga. Jake Sully and Neytiri must protect their family from a new threat that emerges from the volcanic regions of the planet.",
  trailerUrl: "https://www.youtube.com/watch?v=example"
};

export const nowShowingMovies: Movie[] = [
  {
    id: "2",
    title: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
    duration: "2h 46m",
    releaseDate: "Mar 1, 2024",
    genre: ["Sci-Fi", "Adventure"],
    language: "English",
    rating: 8.8,
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge."
  },
  {
    id: "3",
    title: "Kung Fu Panda 4",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop",
    duration: "1h 34m",
    releaseDate: "Mar 8, 2024",
    genre: ["Animation", "Comedy"],
    language: "English",
    rating: 7.2,
    description: "Po must train a new warrior when he is chosen to become the Spiritual Leader."
  },
  {
    id: "4",
    title: "Godzilla x Kong",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
    duration: "1h 55m",
    releaseDate: "Mar 29, 2024",
    genre: ["Action", "Sci-Fi"],
    language: "English",
    rating: 7.5,
    description: "Two legendary titans team up against a colossal undiscovered threat."
  },
  {
    id: "5",
    title: "The Fall Guy",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop",
    duration: "2h 6m",
    releaseDate: "May 3, 2024",
    genre: ["Action", "Comedy"],
    language: "English",
    rating: 7.8,
    description: "A stuntman is thrust back into action when the star of a movie goes missing."
  },
  {
    id: "6",
    title: "Furiosa",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1920&h=1080&fit=crop",
    duration: "2h 28m",
    releaseDate: "May 24, 2024",
    genre: ["Action", "Adventure"],
    language: "English",
    rating: 8.1,
    description: "The origin story of renegade warrior Furiosa before her encounter with Mad Max."
  },
  {
    id: "7",
    title: "Inside Out 2",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
    duration: "1h 36m",
    releaseDate: "Jun 14, 2024",
    genre: ["Animation", "Comedy"],
    language: "English",
    rating: 8.4,
    description: "Riley enters puberty and new emotions emerge in Headquarters."
  },
  {
    id: "8",
    title: "Deadpool & Wolverine",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&h=1080&fit=crop",
    duration: "2h 7m",
    releaseDate: "Jul 26, 2024",
    genre: ["Action", "Comedy"],
    language: "English",
    rating: 8.9,
    description: "Deadpool teams up with Wolverine in a multiverse-spanning adventure."
  },
  {
    id: "9",
    title: "Twisters",
    poster: "https://images.unsplash.com/photo-1527049979667-990f1d0d8e6e?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1527049979667-990f1d0d8e6e?w=1920&h=1080&fit=crop",
    duration: "2h 2m",
    releaseDate: "Jul 19, 2024",
    genre: ["Action", "Thriller"],
    language: "English",
    rating: 7.3,
    description: "Storm chasers face unprecedented tornado activity in Oklahoma."
  },
  {
    id: "10",
    title: "The Wild Robot",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1920&h=1080&fit=crop",
    duration: "1h 41m",
    releaseDate: "Sep 27, 2024",
    genre: ["Animation", "Sci-Fi"],
    language: "English",
    rating: 8.2,
    description: "A robot learns to survive and care for a gosling on a remote island."
  },
  {
    id: "11",
    title: "Venom: The Last Dance",
    poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&h=1080&fit=crop",
    duration: "1h 49m",
    releaseDate: "Oct 25, 2024",
    genre: ["Action", "Sci-Fi"],
    language: "English",
    rating: 7.6,
    description: "Eddie and Venom face their ultimate challenge in this final chapter."
  },
  {
    id: "12",
    title: "Gladiator II",
    poster: "https://images.unsplash.com/photo-1499343162160-cd1441923dd3?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1499343162160-cd1441923dd3?w=1920&h=1080&fit=crop",
    duration: "2h 28m",
    releaseDate: "Nov 22, 2024",
    genre: ["Action", "Drama"],
    language: "English",
    rating: 8.0,
    description: "The epic sequel continues the story of power and vengeance in Rome."
  }
];

export const comingSoonMovies: Movie[] = [
  {
    id: "13",
    title: "Captain America: Brave New World",
    poster: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=1920&h=1080&fit=crop",
    duration: "2h 15m",
    releaseDate: "Feb 14, 2025",
    genre: ["Action", "Sci-Fi"],
    language: "English",
    rating: 0,
    description: "Sam Wilson embraces his role as Captain America in a new world order."
  },
  {
    id: "14",
    title: "Snow White",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1920&h=1080&fit=crop",
    duration: "1h 52m",
    releaseDate: "Mar 21, 2025",
    genre: ["Fantasy", "Musical"],
    language: "English",
    rating: 0,
    description: "A live-action reimagining of the classic fairy tale."
  },
  {
    id: "15",
    title: "Mission: Impossible 8",
    poster: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1920&h=1080&fit=crop",
    duration: "2h 45m",
    releaseDate: "May 23, 2025",
    genre: ["Action", "Thriller"],
    language: "English",
    rating: 0,
    description: "Ethan Hunt faces his most impossible mission yet."
  },
  {
    id: "16",
    title: "Jurassic World Rebirth",
    poster: "https://images.unsplash.com/photo-1559060017-445fb9722f96?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1559060017-445fb9722f96?w=1920&h=1080&fit=crop",
    duration: "2h 20m",
    releaseDate: "Jul 2, 2025",
    genre: ["Action", "Sci-Fi"],
    language: "English",
    rating: 0,
    description: "A new chapter begins in the Jurassic saga."
  }
];

export const cinemas = [
  "IMAX Colombo City Centre",
  "Scope Cinemas - Colombo",
  "Liberty Cinema - Colombo",
  "Majestic Cinema - Colombo",
  "Excel World Entertainment",
  "Savoy 3D Cinema"
];

export const timings = [
  "10:00 AM",
  "12:30 PM",
  "3:00 PM",
  "5:30 PM",
  "8:00 PM",
  "10:30 PM"
];
