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