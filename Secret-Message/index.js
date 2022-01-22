const { hash } = window.location;
const message = atob(hash.replace("#", ""));

if (message) {
  document.querySelector("#message-form").classList.add("hide");
  document.querySelector("#message-show").classList.remove("hide");

  document.querySelector("h1").innerHTML = message;
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  // toogle the input and the new link divs
  document.querySelector("#message-form").classList.add("hide");
  document.querySelector("#link-form").classList.remove("hide");

  const input = document.querySelector("#message-input");
  const encrypted = btoa(input.value);

  console.log(input.value);

  // add the message to the link
  const encryptedLink = `${window.location}#${encrypted}`;
  const linkInput = document.querySelector("#link-input");
  linkInput.value = encryptedLink;
  linkInput.select();
});

/* base64 encoding
    JS has a built in function for this btoa( string) --> returns the encoded string
    and atob(string)  for decoding it
    console.log(btoa("George"));
*/

/* getting current url 
    window.location --> with a trick if u use just in a string it will show only the address
                        not the entire string;
    console.log(`${window.location}`);

    or  console.log(window.location["href"]);

    getting hash from url 
    window.location has a hash property
 
*/
