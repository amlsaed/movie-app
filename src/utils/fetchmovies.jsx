export const fetchMovies = async (searchTerm, page = 1) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;

  const url = `${baseUrl}&page=${page}&with_keywords=${searchTerm}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Full API response:", data);

    // Return full pagination data
    return {
      results: data.results || [],
      page: data.page || 1,
      totalPages: data.total_pages || 1,
      totalResults: data.total_results || 0,
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return {
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };
  }
};

export const fetchTrendingMovies = async (timeWindow = "week", page = 1) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const baseUrl = "https://api.themoviedb.org/3";

  const url = `${baseUrl}/trending/movie/${timeWindow}?page=${page}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Trending movies:", data);

    return {
      results: data.results || [],
      page: data.page || 1,
      totalPages: data.total_pages || 1,
      totalResults: data.total_results || 0,
    };
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return {
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };
  }
};

export const fetchAllMovies = async (page = 1, sortBy = "popularity.desc") => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const baseUrl = "https://api.themoviedb.org/3";

  const url = `${baseUrl}/discover/movie?sort_by=${sortBy}&page=${page}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("All movies:", data);

    return {
      results: data.results || [],
      page: data.page || 1,
      totalPages: data.total_pages || 1,
      totalResults: data.total_results || 0,
    };
  } catch (error) {
    console.error("Error fetching all movies:", error);
    return {
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };
  }
};
