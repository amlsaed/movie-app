import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card.jsx";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import {
  fetchMovies,
  fetchTrendingMovies,
  fetchAllMovies,
} from "./utils/fetchmovies.jsx";
import { Pagination } from "./components/pagination.jsx";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // New state for trending and all movies
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [allMoviesPage, setAllMoviesPage] = useState(1);
  const [allMoviesTotalPages, setAllMoviesTotalPages] = useState(1);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [isLoadingAllMovies, setIsLoadingAllMovies] = useState(false);
  const [activeSection, setActiveSection] = useState("trending"); // 'trending', 'all', or 'search'

  // Load trending movies on component mount
  useEffect(() => {
    const loadTrendingMovies = async () => {
      setIsLoadingTrending(true);
      try {
        const data = await fetchTrendingMovies("week", 1);
        setTrendingMovies(data.results.slice(0, 12)); // Show only first 12 trending movies
      } catch (error) {
        console.error("Error loading trending movies:", error);
        setTrendingMovies([]);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    loadTrendingMovies();
  }, []);

  // Load all movies for the "All Movies" section
  useEffect(() => {
    const loadAllMovies = async () => {
      setIsLoadingAllMovies(true);
      try {
        const data = await fetchAllMovies(allMoviesPage, "popularity.desc");
        setAllMovies(data.results);
        setAllMoviesTotalPages(Math.min(data.totalPages, 500));
      } catch (error) {
        console.error("Error loading all movies:", error);
        setAllMovies([]);
        setAllMoviesTotalPages(1);
      } finally {
        setIsLoadingAllMovies(false);
      }
    };

    if (activeSection === "all") {
      loadAllMovies();
    }
  }, [allMoviesPage, activeSection]);

  // Search movies
  useEffect(() => {
    const loadMovies = async () => {
      if (searchTerm.trim() === "") {
        setActiveSection("trending");
        return;
      }

      setActiveSection("search");
      setIsLoading(true);
      try {
        const data = await fetchMovies(searchTerm, page);
        setMovies(data.results);
        setTotalPages(Math.min(data.totalPages, 500)); // TMDB API limits to 500 pages
      } catch (error) {
        console.error("Error loading movies:", error);
        setMovies([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [page, searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm !== "") {
      setPage(1);
    }
  }, [searchTerm]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === "trending") {
      setSearchTerm("");
    } else if (section === "all") {
      setSearchTerm("");
      setAllMoviesPage(1);
    }
  };

  return (
    <main className="app">
      <div />
      <div>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Section Navigation */}
        <div className="flex justify-center mb-8 mt-8">
          <div className="section-nav flex rounded-lg p-1 space-x-1">
            <button
              onClick={() => handleSectionChange("trending")}
              className={`section-nav-button px-6 py-3 rounded-md transition-all duration-200 font-medium ${
                activeSection === "trending"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => handleSectionChange("all")}
              className={`section-nav-button px-6 py-3 rounded-md transition-all duration-200 font-medium ${
                activeSection === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              All Movies
            </button>
          </div>
        </div>

        {searchTerm && (
          <p className="text-white text-center mb-4">
            Search results for:{" "}
            <span className="text-blue-400 font-semibold">"{searchTerm}"</span>
          </p>
        )}

        {/* Trending Movies Section */}
        {activeSection === "trending" && (
          <section className="mb-12">
            <div className="section-header">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                🔥 Trending This Week
              </h2>
              <p className="text-gray-300 text-center">
                Discover the most popular movies right now
              </p>
            </div>
            {isLoadingTrending ? (
              <div className="spinner-container">
                <Spinner />
                <span className="text-white text-lg">
                  Loading trending movies...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                {trendingMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <Card movie={movie} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* All Movies Section */}
        {activeSection === "all" && (
          <section className="mb-12">
            <div className="section-header">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                🎬 Popular Movies
              </h2>
              <p className="text-gray-300 text-center">
                Browse through the most popular movies of all time
              </p>
            </div>
            {isLoadingAllMovies ? (
              <div className="spinner-container">
                <Spinner />
                <span className="text-white text-lg">Loading movies...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                  {allMovies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                      <Card movie={movie} />
                    </div>
                  ))}
                </div>

                {allMovies.length > 0 && (
                  <Pagination
                    page={allMoviesPage}
                    setPage={setAllMoviesPage}
                    totalPages={allMoviesTotalPages}
                    hasNextPage={allMoviesPage < allMoviesTotalPages}
                  />
                )}
              </>
            )}
          </section>
        )}

        {/* Search Results Section */}
        {activeSection === "search" && (
          <section className="mb-12">
            {isLoading ? (
              <div className="spinner-container">
                <Spinner />
                <span className="text-white text-lg">Searching movies...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                  {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                      <Card movie={movie} />
                    </div>
                  ))}
                </div>

                {movies.length > 0 && (
                  <Pagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    hasNextPage={page < totalPages}
                  />
                )}

                {movies.length === 0 && !isLoading && searchTerm && (
                  <div className="text-center text-gray-400 mt-12">
                    <div className="section-header">
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        No Results Found
                      </h3>
                      <p>
                        No movies found for "{searchTerm}". Try a different
                        search term.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
