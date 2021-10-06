// general search request to API

async function fetchData(searchMovie) {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "4ee3ab99",
      s: searchMovie,
    },
  });
  if (response.data.Error) {
    alert("No movie found with that name!");
  }
  return response.data.Search;
}

// DEBOUNCE WRAPPER FUNCTION --> for reusibility
const debounce = (funct, delay = 1000) => {
  let timeoutId;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      funct.apply(null, args);
    }, delay);
  };
};

// specific request based on first search to API based on id
const onMovieSelect = async (movie, destination) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "4ee3ab99",
      i: movie.imdbID,
    },
  });
  console.log(response.data);
  document.querySelector(destination).innerHTML = movieDetail(response.data);
};

// handle HTML code for movie details (single view)

const movieDetail = (movieData) => {
  return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieData.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieData.Title}</h1>
                    <h4>${movieData.Genre}</h4>
                    <p>${movieData.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
