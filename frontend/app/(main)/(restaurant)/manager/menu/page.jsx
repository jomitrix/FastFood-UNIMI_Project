'use client';
import { withAuth } from '@/utils/withAuth';
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/app/account/AccountHeader";
import MealsList from "@/components/app/manager/menu/MealsList";
import meals from "@/utils/meals.json";

function MealsPage() {
  const router = useRouter();

  const mockRestaurant = {
    name: "Mario",
    surname: "Rossi",
    email: "mario.rossi@example.com",
    username: "La Pizzeria di Mario",
    accountType: "restaurant"
  };

  const mock = mockRestaurant;
  
  //
  // ho spostato i campi come name category ... come campi fuori da data
  // in data invece ci sono tutti gli altri campi bonus del meals.json
  //

  const mockMeals = [
        {
          "id": "1",
          "price": 12.99,
          "currency": "€",
          "name": "Jerk chicken with rice & peas",
          "category": "Chicken",
          "area": "Jamaican",
          "image": "https://www.themealdb.com/images/media/meals/tytyxu1515363282.jpg",
          "ingredients": [
              "Chicken Thighs",
              "Lime",
              "Spring Onions",
              "Ginger",
              "Garlic",
              "Onion",
              "Red Chilli",
              "Thyme",
              "Lime",
              "Soy Sauce",
              "Vegetable Oil",
              "Brown Sugar",
              "Allspice",
              "Basmati Rice",
              "Coconut Milk",
              "Spring Onions",
              "Thyme",
              "Garlic",
              "Allspice",
              "Kidney Beans"
          ],
          "data": {
              "_id": {
              "$oid": "681c717ea327223432641bb0"
            },
            "idMeal": "52937",
            "strMealAlternate": null,
            "strInstructions": "To make the jerk marinade, combine all the ingredients in a food processor along with 1 tsp salt, and blend to a purée. If you’re having trouble getting it to blend, just keep turning off the blender, stirring the mixture, and trying again. Eventually it will start to blend up – don’t be tempted to add water, as you want a thick paste.\r\n\r\nTaste the jerk mixture for seasoning – it should taste pretty salty, but not unpleasantly, puckering salty. You can now throw in more chillies if it’s not spicy enough for you. If it tastes too salty and sour, try adding in a bit more brown sugar until the mixture tastes well balanced.\r\n\r\nMake a few slashes in the chicken thighs and pour the marinade over the meat, rubbing it into all the crevices. Cover and leave to marinate overnight in the fridge.\r\n\r\nIf you want to barbecue your chicken, get the coals burning 1 hr or so before you’re ready to cook. Authentic jerked meats are not exactly grilled as we think of grilling, but sort of smoke-grilled. To get a more authentic jerk experience, add some wood chips to your barbecue, and cook your chicken over slow, indirect heat for 30 mins. To cook in the oven, heat to 180C/160C fan/gas 4. Put the chicken pieces in a roasting tin with the lime halves and cook for 45 mins until tender and cooked through.\r\n\r\nWhile the chicken is cooking, prepare the rice & peas. Rinse the rice in plenty of cold water, then tip it into a large saucepan with all the remaining ingredients except the kidney beans. Season with salt, add 300ml cold water and set over a high heat. Once the rice begins to boil, turn it down to a medium heat, cover and cook for 10 mins.\r\n\r\nAdd the beans to the rice, then cover with a lid. Leave off the heat for 5 mins until all the liquid is absorbed. Squeeze the roasted lime over the chicken and serve with the rice & peas, and some hot sauce if you like it really spicy.",
            "strTags": "Chilli,Curry",
            "strYoutube": "https://www.youtube.com/watch?v=qfchrS2D_v4",
            "strSource": "https://www.bbcgoodfood.com/recipes/2369635/jerk-chicken-with-rice-and-peas",
            "strImageSource": null,
            "strCreativeCommonsConfirmed": null,
            "dateModified": null,
            "measures": [
              "12",
              "1/2 ",
              "1  bunch",
              "1 tbs chopped",
              "3 cloves",
              "1/2 ",
              "3 chopped",
              "1/2 teaspoon",
              "Juice of 1",
              "2 tbs",
              "2 tbs",
              "3 tbs",
              "1 tbs",
              "200g",
              "400g",
              "1  bunch",
              "2 sprigs",
              "2 cloves chopped",
              "1 tbs",
              "800g"
            ]
          }
        },
        {
          "id": "2",
          "price": 12.99,
          "currency": "€",
          "name": "Jamaican Beef Patties",
          "category": "Beef",
          "area": "Jamaican",
          "image": "https://www.themealdb.com/images/media/meals/wsqqsw1515364068.jpg",
          "ingredients": [
              "Plain Flour",
              "Salt",
              "Curry Powder",
              "Butter",
              "Water",
              "Minced Beef",
              "Allspice",
              "Black Pepper",
              "Vegetable Oil",
              "Onions",
              "Red Pepper",
              "Garlic",
              "Thyme",
              "Salt",
              "Tomato Ketchup",
              "Water",
              "Onions",
              "Egg",
              "Water",
              "Water"
          ],
          "data": {
            "_id": {
              "$oid": "681c717ea327223432641bb1"
            },
            "idMeal": "52938",
            "strMealAlternate": null,
            "strInstructions": "Make the Pastry Dough\r\n\r\nTo a large bowl, add flour, 1 teaspoon salt, and turmeric and mix thoroughly.\r\nRub shortening into flour until there are small pieces of shortening completely covered with flour.\r\nPour in 1/2 cup of the ice water and mix with your hands to bring the dough together. Keep adding ice water 2 to 3 tablespoons at a time until the mixture forms a dough.\r\nAt this stage, you can cut the dough into 2 large pieces, wrap in plastic and refrigerate for 30 minutes before using it.\r\nAlternatively, cut the dough into 10 to 12 equal pieces, place on a platter or baking sheet, cover securely with plastic wrap and let chill for 30 minutes while you make the filling.\r\nMake the Filling\r\n\r\nAdd ground beef to a large bowl. Sprinkle in allspice and black pepper. Mix together and set aside.\r\nHeat oil in a skillet until hot.\r\nAdd onions and sauté until translucent. Add hot pepper, garlic and thyme and continue to sauté for another minute. Add 1/4 teaspoon salt.\r\nAdd seasoned ground beef and toss to mix, breaking up any clumps, and let cook until the meat is no longer pink.\r\nAdd ketchup and more salt to taste.\r\nPour in 2 cups of water and stir. Bring the mixture to a boil then reduce heat and let simmer until most of the liquid has evaporated and whatever is remaining has reduced to a thick sauce.\r\nFold in green onions. Remove from heat and let cool completely.\r\nAssemble the Patties\r\n\r\nBeat the egg and water together to make an egg wash. Set aside.\r\nNow you can prepare the dough in two ways.\r\nFirst Method: Flour the work surface and rolling pin. If you had cut it into 2 large pieces, then take one of the large pieces and roll it out into a very large circle. Take a bowl with a wide rim (about 5 inches) and cut out three circles.\r\n\r\nPlace about 3 heaping tablespoons of the filling onto 1/2 of each circle. Dip a finger into the water and moisten the edges of the pastry. Fold over the other half and press to seal. \r\n\r\nTake a fork and crimp the edges. Cut off any extra to make it look neat and uniform. Place on a parchment-lined baking sheet and continue to work until you have rolled all the dough and filled the patties.\r\nSecond Method: If you had pre-cut the dough into individual pieces, work with one piece of dough at a time. Roll it out on a floured surface into a 5-inch circle or a little larger. Don’t worry if the edges are not perfect.\r\n\r\nPlace 3 heaping tablespoons of the filling on one side of the circle. Dip a finger into the water and moisten the edges of the pastry. Fold over the other half and press to seal.\r\n\r\nTake a fork and crimp the edges. Cut off any extra to make it look neat and uniform. Place on a parchment-lined baking sheet and continue work until you have rolled all the dough and filled the patties.\r\n\r\nFrying and Serving the Patties\r\n\r\nAfter forming the patties, place the pans in the refrigerator while you heat the oven to 350 F.\r\nJust before adding the pans with the patties to the oven, brush the patties with egg wash.\r\nBake patties for 30 minutes or until golden brown.\r\nCool on wire racks.\r\nServe warm.",
            "strTags": "Snack,Spicy",
            "strYoutube": "https://www.youtube.com/watch?v=ypQjoiZiTac",
            "strSource": "https://www.thespruce.com/jamaican-beef-patties-recipe-2137762",
            "strImageSource": null,
            "strCreativeCommonsConfirmed": null,
            "dateModified": null,
            "measures": [
              "4 cups ",
              "1 tsp ",
              "1 tsp ",
              "250g",
              "1 cup ",
              "900g",
              "1 tsp ",
              "1/2 tsp",
              "2 tbs",
              "1 cup ",
              "Ground",
              "2 tsp ground",
              "1 tbs",
              "1/4 tsp",
              "2 tbs",
              "2 cups ",
              "1/2 cup ",
              "1 beaten",
              "1 tbs",
              "1/4 cup"
            ]
          }
        },
        {
          "id": "3",
          "price": 12.99,
          "currency": "€",
          "name": "Japanese gohan rice",
          "category": "Side",
          "area": "Japanese",
          "instructions": "STEP 1\r\nRinsing and soaking your rice is key to achieving the perfect texture. Measure the rice into a bowl, cover with cold water, then use your fingers to massage the grains of rice – the water will become cloudy. Drain and rinse again with fresh water. Repeat five more times until the water stays clear.\r\n\r\nSTEP 2\r\nTip the rinsed rice into a saucepan with 400ml water, or 200ml dashi and 200ml water, bring to the boil, then turn down the heat to a low simmer, cover with a tight-fitting lid with a steam hole and cook for 15 mins. Remove from the heat and leave to sit for another 15 mins, then stir through the mirin. Remove the lid and give it a good stir. Serve with any or all of the optional toppings.",
          "image": "https://www.themealdb.com/images/media/meals/kw92t41604181871.jpg",
          "ingredients": [
              "Sushi Rice",
              "Mirin",
              "Pickle Juice",
              "Spring Onions"
          ],
          "data": {
            "_id": {
              "$oid": "681c717ea327223432641bb2"
            },
            "idMeal": "53033",
            "strMealAlternate": null,
            "strTags": null,
            "strYoutube": "https://www.youtube.com/watch?v=rZO86_-MIp0",
            "strSource": "https://www.bbcgoodfood.com/recipes/japanese-rice-gohan",
            "strImageSource": null,
            "strCreativeCommonsConfirmed": null,
            "dateModified": null,
            "measures": [
              "300g",
              "1 tbs",
              "Garnish",
              "Garnish"
            ]
          }
        },
  ];

  useEffect(() => {
    // Controllo se l'utente è autenticato
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (/*!*/token) {
      router.push("/auth/login");
    }
  }, [router]);

  if (mock.accountType !== "restaurant") {
    notFound();
  }

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        accountType={mock.accountType}
        title="Menu Management"
        subtitle="Manage your restaurant's menu"
      />

      <div className="w-full lg:w-2/3 flex flex-col justify-center items-center p-4 pb-12">
        <MealsList 
          searchMeals={meals}
          meals={mockMeals}
        />
      </div>   
    </div>
  );
}

export default withAuth(MealsPage);