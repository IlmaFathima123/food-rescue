import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../lib/api";
import { useFood } from "../context/FoodContext";
import StatStrip from "../components/StatStrip";
import FoodCard from "../components/FoodCard";

const STEPS = [
  {
    n: "01",
    title: "A business posts surplus food",
    body: "Bakeries, restaurants, hotels and supermarkets list what's left before closing — free or discounted.",
  },
  {
    n: "02",
    title: "You find food nearby",
    body: "Search and filter listings by location, food type and price to find something near you.",
  },
  {
    n: "03",
    title: "Claim it and pick it up",
    body: "Reserve a quantity, get a reservation ID, and collect it before the pickup deadline.",
  },
];

export default function Home() {
  const { listings } = useFood();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.fetchDashboardStats().then(setStats);
  }, []);

  const featured = listings.filter((l) => l.status === "available").slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-14">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05]">
            Don't waste food.
            <br />
            Share it.
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-lg">
            FoodRescue LK connects surplus food from local businesses with the
            people and organizations near them who can still use it — before
            it's thrown away.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/find"
              className="px-6 py-3 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
            >
              Find food
            </Link>
            <Link
              to="/donate"
              className="px-6 py-3 text-sm font-semibold text-ink border border-ink/20 hover:border-ink/40 transition-colors"
            >
              Donate food
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        {stats && (
          <StatStrip
            stats={[
              { label: "Meals rescued", value: stats.mealsRescued.toLocaleString() },
              { label: "Food providers", value: stats.foodProviders },
              { label: "People helped", value: stats.peopleHelped.toLocaleString() },
              { label: "Food saved", value: `${stats.kgSaved}kg` },
            ]}
          />
        )}
      </section>

      {/* How it works */}
      <section className="bg-leaf-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <h2 className="font-display text-3xl mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n}>
                <p className="font-display text-3xl text-leaf-deep">{step.n}</p>
                <h3 className="mt-3 font-semibold text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl">Available right now</h2>
            <Link to="/find" className="text-sm font-semibold text-leaf-deep hover:underline">
              See all listings →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((listing) => (
              <FoodCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="bg-turmeric-light border border-turmeric/30 px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl">Have surplus food today?</h2>
            <p className="mt-2 text-ink-soft max-w-md">
              Listing takes under two minutes. It could feed someone before closing time.
            </p>
          </div>
          <Link
            to="/donate"
            className="shrink-0 px-6 py-3 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
          >
            Post surplus food
          </Link>
        </div>
      </section>
    </div>
  );
}
