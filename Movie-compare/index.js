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

async function fetchData2() {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "4ee3ab99",
      i: "tt0848228",
    },
  });

  console.log(response.data);
}

// SEARCH WIDGET

const input = document.querySelector("input");

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

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);

  // display some movie info in browser
  for (let movie of movies) {
    const div = document.createElement("div");

    div.innerHTML = `
        <img src="${movie.Poster}"/>
        <h1>${movie.Title}</h1>
        `;

    document.querySelector("#target").appendChild(div);
  }
};

input.addEventListener("input", debounce(onInput));
