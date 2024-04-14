import { getMealDetails } from "./modules/fetchMealsAPI.js";

// Fetching mealId from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const mealId = urlParams.get("id");

updateDetails(mealId);

// Update Page as per selected meal
const nameEl = document.getElementById("meal-name");
const categoryEl = document.getElementById("meal-category");
const countryEl = document.getElementById("meal-country");
const imgEl = document.getElementById("meal-img");
const tagsEl = document.getElementById("tags");
const ingredientsEl = document.querySelector(".ingredients");
const ingredientsList = document.querySelector(".ingredients ol");
const instructionsEl = document.getElementById("instructions-para");
const videoEl = document.getElementById("meal-video");

async function updateDetails(mealId) {
  const {
    name,
    category,
    country,
    image,
    tags,
    ingredients,
    instructions,
    video,
  } = await getMealDetails(mealId);

  nameEl.textContent = name;
  categoryEl.textContent = `Category: ${category}`;
  countryEl.textContent = `Country: ${country}`;
  imgEl.src = image;
  videoEl.src = video.replace("watch?v=", "embed/");
  instructionsEl.textContent = instructions;

  tagsEl.innerHTML = "<strong>Tags: </strong>";

  if (tags != null && tags.split(",").length > 0) {
    tags.split(",").forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsEl.appendChild(span);
    });
  } else {
    tagsEl.innerHTML = "<strong>Tags: No Tags</strong>";
  }

  if (ingredients.length <= 0) {
    ingredientsEl.style.display = "none";
  } else {
    ingredientsEl.style.display = "block";
    ingredientsEl.innerHTML = "<h2>Ingredients</h2>";
    ingredients.forEach((ing) => {
      const li = document.createElement("li");
      li.textContent = ing;
      ingredientsList.appendChild(li);
    });
    ingredientsEl.appendChild(ingredientsList);

    if (ingredients.length > 4) {
      const p = document.createElement("p");
      p.setAttribute("id", "more");
      p.textContent = "Show more";
      p.onclick = showMoreLess;

      ingredientsEl.appendChild(p);
    }
  }
}

// This functions is to have expand/contract behavior of ingredinets section based on some conditions
function showMoreLess() {
  const list = document.querySelector(".ingredients ol");

  if (list.style.height != "auto") {
    list.style.height = "auto";
  } else {
    list.style.height = "100px";
  }

  if (list.style.borderBottom != "none") {
    list.style.borderBottom = "none";
  } else {
    list.style.borderBottom = "6px solid rgba(100, 100, 100, 0.1)";
  }

  if (this.textContent == "Show more") {
    this.textContent = "Show less";
  } else {
    this.textContent = "Show more";
  }
}
