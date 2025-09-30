"use client";
import { useState } from "react";

const RECIPES = [
  { id:"nig-chicken-stew", title:"Nigerian Tomato Chicken Stew", country:"Nigeria", calories:520, protein:45, carbs:18, costPerServe:2.3, ingredients:["chicken thighs","tomato","onion","garlic","oil","bouillon"], steps:["Sear chicken, remove.","Sauté onion/garlic, add tomato & simmer.","Return chicken to finish."] },
  { id:"mx-tuna-lettuce-wraps", title:"Tuna Lettuce Wraps (Chipotle Lime)", country:"Mexico", calories:340, protein:36, carbs:9, costPerServe:1.6, ingredients:["canned tuna","lettuce","mayo","chipotle","lime","onion"], steps:["Mix tuna + mayo + chipotle + lime.","Spoon into lettuce leaves."] },
  { id:"it-turkey-zucchini", title:"Italian Turkey & Zucchini Skillet", country:"Italy", calories:410, protein:38, carbs:12, costPerServe:2.1, ingredients:["ground turkey","zucchini","bell pepper","garlic","tomato paste"], steps:["Brown turkey.","Add veg + paste; simmer 6–8 min."] },
  { id:"us-salmon-greenbeans", title:"Sheet-Pan Salmon & Green Beans", country:"USA", calories:460, protein:42, carbs:10, costPerServe:3.4, ingredients:["salmon","green beans","olive oil","lemon","salt","pepper"], steps:["Roast 400°F 12–14 min.","Finish with lemon."] },
  { id:"in-chana-salad", title:"Chana Masala Protein Salad (No Rice)", country:"India", calories:380, protein:21, carbs:30, costPerServe:1.2, ingredients:["chickpeas","tomato","onion","garam masala","cilantro","yogurt"], steps:["Toss chickpeas with spices & veg.","Dollop yogurt."] },
];

const COUNTRIES = ["Any","USA","Mexico","Italy","Nigeria","India","Japan","Thailand","Greece","Brazil"];

function generatePlan(calories, country, budget, haveRaw) {
  let list = RECIPES.filter(r => country === "Any" || r.country === country);
  list = [...list].sort((a,b)=> b.protein - a.protein);
  list = [...list].sort((a,b)=> a.carbs - b.carbs);

  const have = haveRaw.split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
  if (have.length) {
    list = list
      .map(r => ({ r, score: r.ingredients.reduce((n,ing)=> n + (have.some(h=> ing.toLowerCase().includes(h)) ? 1 : 0), 0) }))
      .sort((a,b)=> b.score - a.score)
      .map(x=>x.r);
  }
  if (budget) list = [...list].sort((a,b)=> a.costPerServe - b.costPerServe);

  const byCal = [...list].sort((a,b)=> Math.abs(a.calories - calories) - Math.abs(b.calories - calories));
  const chosen = byCal.slice(0,3);

  const plan = [0,1,2].map(i => ({
    day: i+1,
    meals: [
      { type:"Breakfast", recipe: chosen[i % chosen.length] },
      { type:"Lunch",     recipe: chosen[(i+1) % chosen.length] },
      { type:"Dinner",    recipe: chosen[(i+2) % chosen.length] },
    ]
  }));

  const groceryMap = new Map();
  plan.forEach(d => d.meals.forEach(m => m.recipe.ingredients.forEach(ing => {
    const k = ing.toLowerCase();
    groceryMap.set(k, (groceryMap.get(k) || 0) + 1);
  })));
  const grocery = Array.from(groceryMap.entries()).map(([item,count]) => ({ item, count }));

  const estCostTotal = plan.reduce((sum,d) => sum + d.meals.reduce((s,m)=> s + m.recipe.costPerServe, 0), 0);
  return { plan, grocery, estCostTotal };
}

export default function MealPlannerPage() {
  const [calories, setCalories] = useState("500");
  const [country, setCountry] = useState("Any");
  const [budget, setBudget] = useState(false);
  const [have, setHave] = useState("");
  const [result, setResult] = useState(null);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Meal Planner</h1>
        <p className="text-slate-600">Choose calories, country, and ingredients you have. Get a 3-day plan + grocery list.</p>
      </header>

      <div className="rounded-2xl border bg-white p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Calories per meal</label>
            <input className="w-full rounded-xl border px-3 py-2 text-sm" inputMode="numeric"
              value={calories} onChange={(e)=> setCalories(e.target.value)} placeholder="e.g., 500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Country / Cuisine</label>
            <select className="w-full rounded-xl border px-3 py-2 text-sm" value={country} onChange={(e)=> setCountry(e.target.value)}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Weekly budget</label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={budget} onChange={(e)=> setBudget(e.target.checked)} />
              Prioritize low cost
            </label>
          </div>
          <div className="space-y-2 md:col-span-1 md:row-span-2">
            <label className="text-sm font-medium">Ingredients you have</label>
            <textarea className="w-full rounded-xl border px-3 py-2 text-sm min-h-[88px]"
              value={have} onChange={(e)=> setHave(e.target.value)} placeholder="chicken, onion, spinach" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={()=> setResult(generatePlan(Number(calories)||500, country, budget, have))}
            className="rounded-2xl px-4 py-2 bg-black text-white text-sm">
            Generate 3-Day Plan
          </button>
          <button onClick={()=> setResult(null)} className="rounded-2xl px-4 py-2 border text-sm">Reset</button>
        </div>
      </div>

      {result ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-lg font-semibold mb-2">3-Day Meal Plan</div>
            {result.plan.map(day => (
              <div key={day.day} className="mb-4">
                <div className="font-semibold mb-2">Day {day.day}</div>
                <ul className="space-y-1">
                  {day.meals.map((m,idx)=> (
                    <li key={idx}><span className="font-medium">{m.type}:</span> {m.recipe.title} ({m.recipe.calories} kcal)</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="text-lg font-semibold mb-2">Smart Grocery List</div>
            <ul className="list-disc list-inside">
              {result.grocery.map((g,i)=> <li key={i}>{g.item} ×{g.count}</li>)}
            </ul>
            <div className="mt-4 text-sm">Estimated total (3 days): <strong>${result.estCostTotal.toFixed(2)}</strong></div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed bg-white p-10 text-center text-slate-600">
          Use the filters above and click <span className="font-semibold">Generate 3-Day Plan</span>.
        </div>
      )}
    </div>
  );
}
