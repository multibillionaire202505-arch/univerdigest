export default function Home() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">UniverDigest</h1>
        <p className="text-slate-600">
          Global meals, nutrition, and smart grocery lists.
        </p>
      </div>
      <p className="text-slate-600 max-w-prose">
        Use the Meal Planner to generate a 3-day plan and a smart grocery list.
        Live APIs coming next.
      </p>
      <div>
        <a
          href="/meal-planner"
          className="inline-block rounded-2xl px-4 py-2 bg-slate-900 text-white"
        >
          Open Meal Planner →
        </a>
      </div>
    </div>
  );
}
