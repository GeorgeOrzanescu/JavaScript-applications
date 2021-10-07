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

// specific request based on first search to API based on id
const onMovieSelect = async (movie, destination) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "4ee3ab99",
      i: movie.imdbID,
    },
  });
  document.querySelector(destination).innerHTML = movieDetail(response.data);

  // create 2 sets of objects to compare
  if (destination == "#left-summary") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  // run compare function when both movies are retrieved
  if (this.leftMovie && this.rightMovie) {
    runComparison(leftMovie, rightMovie);
  }
};

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

// function that compares the two movies

const runComparison = ({ ...left }, { ...right }) => {
  //stats left movie
  const dollarsl = parseInt(
    left.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascorel = parseInt(left.Metascore);
  const imdbRatingl = parseFloat(left.imdbRating);
  const imdbVotesl = parseInt(left.imdbVotes.replace(/,/g, ""));

  const awardsl = left.Awards.split(" ").reduce((first, value) => {
    const award = parseInt(value);

    if (isNaN(award)) {
      return first;
    } else {
      return first + award;
    }
  }, 0);

  const leftStats = [awardsl, dollarsl, metascorel, imdbRatingl, imdbVotesl];

  //stats right movie
  const dollarsr = parseInt(
    right.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascorer = parseInt(right.Metascore);
  const imdbRatingr = parseFloat(right.imdbRating);
  const imdbVotesr = parseInt(right.imdbVotes.replace(/,/g, ""));

  const awardsr = right.Awards.split(" ").reduce((first, value) => {
    const award = parseInt(value);

    if (isNaN(award)) {
      return first;
    } else {
      return first + award;
    }
  }, 0);

  const rightStats = [awardsr, dollarsr, metascorer, imdbRatingr, imdbVotesr];

  // get html elements to change on comparison
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftStats.forEach((stat, index) => {
    if (stat > rightStats[index]) {
      rightSideStats[index].classList.remove("is-primary");
      rightSideStats[index].classList.add("is-warning");
    } else if (stat < rightStats[index]) {
      leftSideStats[index].classList.remove("is-primary");
      leftSideStats[index].classList.add("is-warning");
    }
  });
};
