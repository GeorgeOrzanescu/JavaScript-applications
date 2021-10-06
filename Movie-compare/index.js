// SEARCH WIDGET
const root = document.querySelector("#left-autocomplete");
const root2 = document.querySelector("#right-autocomplete");

root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>

`;
root2.innerHTML = root.innerHTML;

const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const dropdown2 = document
  .querySelector("#right-autocomplete")
  .querySelector(".dropdown");
const resultsWrapper2 = document
  .querySelector("#right-autocomplete")
  .querySelector(".results");

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
      onMovieSelect(movie, "#left-summary");
    });
  }
};

const onInput2 = async (event) => {
  const movies = await fetchData(event.target.value);
  resultsWrapper2.innerHTML = "";
  dropdown2.classList.add("is-active");

  // display some movie info in browser
  for (let movie of movies) {
    const option = document.createElement("div");
    option.classList.add("dropdown-item");
    option.innerHTML = `
        <img src="${movie.Poster}"/>
        <h1>${movie.Title}</h1>
        `;

    resultsWrapper2.appendChild(option);
    option.addEventListener("click", () => {
      dropdown2.classList.remove("is-active");
      input2.value = movie.Title;
      onMovieSelect(movie, "#right-summary");
    });
  }
};

const input = document.querySelector("input");
input.addEventListener("input", debounce(onInput));

const input2 = document
  .querySelector("#right-autocomplete")
  .querySelector("input");
input2.addEventListener("input", debounce(onInput2));

// handles closing the search result dropdown when clicking outside it
document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});
document.addEventListener("click", (event) => {
  if (!root2.contains(event.target)) {
    dropdown2.classList.remove("is-active");
  }
});
