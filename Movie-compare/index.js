// SEARCH WIDGET
const input = document.querySelector("input");

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
