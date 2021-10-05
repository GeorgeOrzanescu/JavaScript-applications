// SEARCH WIDGET
const root = document.querySelector(".search_holder");

root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>

`;

const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);
  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");

  // display some movie info in browser
  for (let movie of movies) {
    const option = document.createElement("div");
    option.classList.add("dropdown-item");
    option.innerHTML = `
        <img src="${movie.Poster}"/>
        <h1>${movie.Title}</h1>
        `;

    resultsWrapper.appendChild(option);
    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
      onMovieSelect(movie);
    });
  }
};

const input = document.querySelector("input");
input.addEventListener("input", debounce(onInput));

// handles closing the serach result dropdown when clicking outside it
document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});
