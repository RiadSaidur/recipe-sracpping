const puppeteer = require('puppeteer');
const fs = require('fs');

let recipies = [];
let urls = [
  'https://www.allbanglarecipe.com/recipe/%e0%a6%86%e0%a6%aa%e0%a7%87%e0%a6%b2-%e0%a6%b8%e0%a6%a8%e0%a7%8d%e0%a6%a6%e0%a7%87%e0%a6%b6/',
  'https://www.allbanglarecipe.com/recipe/%e0%a6%ae%e0%a6%bf%e0%a6%b7%e0%a7%8d%e0%a6%9f%e0%a6%bf-%e0%a6%b0%e0%a6%b8%e0%a6%97%e0%a7%8b%e0%a6%b2%e0%a7%8d%e0%a6%b2%e0%a6%be/'
];

const scrap =  async () => {
  if(urls.length){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const url = urls.pop();
    
    await page.goto(url);

    const facts = await page.evaluate(() => Array.from(document.querySelectorAll(".value")).map(node => node.textContent));

    let unrefined = await page.evaluate(() => Array.from(document.querySelectorAll(".ingredients-list li")).map(node => node.textContent))
    const ingredients = unrefined.filter(ingredient => !ingredient.includes("Step"));
    
    const recipe = {
      title: await page.evaluate(() => document.querySelector(".post-title").innerText),
      description: await page.evaluate(() => document.querySelector(".post-content").firstElementChild.textContent),
      steps: await page.evaluate(() => Array.from(document.querySelectorAll(".step-content")).map(step => step.textContent)),
      picture: await page.evaluate(() => document.querySelector(".featured-image").src),
      time: facts[1],
      person: facts[4],
      category: facts[6],
      ingredients
    }

    // console.log(recipe);
    recipies.push(recipe);

    await browser.close();

    await scrap();
  }
  
  else return;

}

(async () => {

  await scrap();
  jsonRecipe = JSON.stringify(recipies);
  fs.writeFileSync("recipies.json", jsonRecipe)
  
})();