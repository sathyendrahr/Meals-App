import { getMeals } from "./modules/fetchMealsAPI.js";

const favorites = document.getElementById("favorites");
const closeBtn = document.getElementById("close-btn");
const myfavorites = document.getElementById("my-favorites");

myfavorites.addEventListener("click", () => {
  favorites.style.height = "100vh";
  favorites.style.opacity = 1;
  renderFavorites();
});

closeBtn.onclick = function () {
  favorites.style.height = "0vh";
  favorites.style.opacity = 0;
};

/* Favorites section */
// localStorage.clear();

function addToFavorites(meal) {
  if (typeof Storage !== "undefined") {
    localStorage.setItem(`${meal.id}`, meal.name);
    renderFavorites();
  } else {
    alert("Sorry, your browser does not support web storage...");
  }
}

function renderFavorites() {
  const keys = Object.keys(localStorage);
  keys.reverse();

  const container = document.querySelector(".list-container");
  container.innerHTML = "";

  if (!keys) return;

  for (let key of keys) {
    const mealName = localStorage.getItem(key);

    const div = document.createElement("div");
    div.classList.add("list-item");

    const anchor = document.createElement("a");
    anchor.href = `meal.html?id=${key}`;
    anchor.target = "_blank";

    const span = document.createElement("span");
    span.textContent = mealName;

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");

    deleteIcon.addEventListener("click", () => {
      localStorage.removeItem(key);
      renderFavorites();
    });

    anchor.appendChild(span);

    div.append(anchor, deleteIcon);
    container.appendChild(div);
  }
}

/* Meals Suggestions */

// Debouncing to improve performance - where we are introducing some delay for consecutive API call
const useDebounce = (func, delay) => {
  let timeout = null;

  return (...args) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const debouncedShowSuggestions = useDebounce(showSuggestions, 600);

async function showSuggestions() {
  const suggestionsDiv = document.getElementById("suggestions");
  suggestionsDiv.innerHTML = "";

  const searchText = searchInput.value;
  if (searchText == "") {
    suggestionsDiv.style.display = "none";
    return;
  }
  const suggestions = await getMeals(searchText);

  suggestionsDiv.style.display = "flex";

  if (suggestions.length <= 0) {
    suggestionsDiv.innerHTML = "<strong>No matching results</strong>";
    suggestionsDiv.style.fontSize = "large";
    return;
  }

  suggestions.forEach((s) => {
    setData(s);
  });
}

function setData(s) {
  const suggestionsDiv = document.getElementById("suggestions");

  const div = document.createElement("div");
  div.classList.add("suggestion-item");

  const anchor = document.createElement("a");
  anchor.href = `meal.html?id=${s.id}`;
  anchor.target = "_blank";

  const textDiv = document.createElement("div");
  textDiv.textContent = s.name;
  textDiv.style.width = "100%";

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-heart");

  if (localStorage.getItem(s.id)) {
    icon.classList.add("red-heart");
  } else {
    icon.addEventListener("click", (event) => {
      event.stopPropagation();
      icon.style.color = "red";
      addToFavorites(s);
    });
  }

  anchor.appendChild(textDiv);
  div.append(anchor, icon);

  suggestionsDiv.appendChild(div);
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", debouncedShowSuggestions);
