import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { portfolioEvents } from "../data/siteContent";

const tabConfig = [
  { value: "weddings", label: "Weddings" },
  { value: "corporate", label: "Corporate Events" },
  { value: "sfx-entries", label: "SFX & Entries" },
];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("weddings");
  const activeEvents = useMemo(() => portfolioEvents[activeTab] || [], [activeTab]);

  return (
    <div className="bg-[#F5EFE6] px-5 pb-20 pt-28 sm:px-8 lg:px-12" data-testid="portfolio-page">
      <section className="mx-auto w-full max-w-6xl text-center" data-testid="portfolio-hero-section">
        <h1 className="serif-display text-4xl text-[#350A13] sm:text-5xl lg:text-6xl" data-testid="portfolio-heading">
          Celebrations, Curated to Perfection.
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10" data-testid="portfolio-tabs">
          <TabsList className="h-auto flex-wrap gap-2 bg-transparent p-0" data-testid="portfolio-tabs-list">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent bg-transparent px-1 pb-2 text-xs uppercase tracking-[0.24em] text-[#4B0F1B] shadow-none data-[state=active]:border-[#C6A75E] data-[state=active]:text-[#C6A75E]"
                data-testid={`portfolio-tab-${tab.value}`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      <section className="mx-auto mt-12 w-full max-w-7xl" key={activeTab} data-testid="portfolio-grid-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" data-testid="portfolio-grid">
          {activeEvents.map((event) => (
            <Link
              key={event.id}
              to={`/portfolio/${activeTab}/${event.id}`}
              className="group overflow-hidden rounded-2xl border border-[#4B0F1B]/10 bg-white"
              data-testid={`portfolio-card-${event.id}`}
            >
              <img
                src={event.cover}
                alt={event.title}
                loading="lazy"
                className="aspect-[5/4] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                data-testid={`portfolio-card-image-${event.id}`}
              />
              <div className="p-6">
                <h2 className="serif-display text-2xl text-[#350A13]" data-testid={`portfolio-card-title-${event.id}`}>
                  {event.title}
                </h2>
                <p className="mt-2 text-sm text-[#4B0F1B]" data-testid={`portfolio-card-subtitle-${event.id}`}>
                  {event.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}