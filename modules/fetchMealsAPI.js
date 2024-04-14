async function fetchURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Something went wrong! Error code: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

async function getMeals(name) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
  const meals = await fetchURL(url);

  const mealList = meals.meals;
  const result = [];
  if (mealList != null) {
    mealList.forEach((meal) => {
      result.push({
        id: meal.idMeal,
        name: meal.strMeal,
      });
    });
  }

  return result;
}

async function getMealDetails(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const meals = await fetchURL(url);

  let meal = meals.meals[0];

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingr = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingr !== "" && measure != "") ingredients.push(`${ingr} - ${measure}`);
    else break;
  }
  return {
    name: meal.strMeal,
    category: meal.strCategory,
    country: meal.strArea,
    image: meal.strMealThumb,
    tags: meal.strTags,
    ingredients: ingredients,
    instructions: meal.strInstructions.replaceAll("\r\n\r\n", "<br><br>"),
    video: meal.strYoutube,
  };
}

export { getMeals, getMealDetails };
