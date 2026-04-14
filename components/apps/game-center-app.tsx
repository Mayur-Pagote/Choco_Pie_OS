"use client";

import { useMemo, useRef, useState } from "react";

import { AppIcon } from "@/components/icons/pi-icons";
import { GAME_CENTER_GAMES, type GameCenterEntry } from "@/lib/game-catalog";
import { useOsStore } from "@/store/os-store";

type PrimaryView = "store" | "about";
type StoreTab = "popular" | "new";

export function GameCenterApp() {
  const openApp = useOsStore((state) => state.openApp);
  const desktopTheme = useOsStore((state) => state.desktopTheme);
  const isDark = desktopTheme === "dark";

  const [activeView, setActiveView] = useState<PrimaryView>("store");
  const [activeTab, setActiveTab] = useState<StoreTab>("popular");
  const [search, setSearch] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasSearchText = search.trim().length > 0;

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    return GAME_CENTER_GAMES.filter((game) => {
      const matchesQuery =
        query.length === 0 ||
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesQuery;
    });
  }, [search]);

  const heroPool = useMemo(() => {
    if (filteredGames.length > 0) {
      return filteredGames;
    }

    return hasSearchText ? [] : GAME_CENTER_GAMES;
  }, [filteredGames, hasSearchText]);

  const whisperingShadows = useMemo(
    () =>
      heroPool.find((game) => game.id === "whispering-shadows") ??
      heroPool[0],
    [heroPool],
  );

  const riddles = useMemo(
    () =>
      heroPool.find((game) => game.id === "riddles") ??
      heroPool.find((game) => game.id !== whisperingShadows?.id),
    [heroPool, whisperingShadows?.id],
  );

  const popularReleaseGames = useMemo(
    () =>
      filteredGames.filter(
        (game) => game.id !== whisperingShadows?.id && game.id !== riddles?.id,
      ),
    [filteredGames, riddles?.id, whisperingShadows?.id],
  );

  const topCarouselGames = useMemo(
    () => (popularReleaseGames.length > 0 ? popularReleaseGames : filteredGames),
    [filteredGames, popularReleaseGames],
  );

  const listedGames = useMemo(() => {
    const source = popularReleaseGames.length > 0 ? popularReleaseGames : filteredGames;
    return activeTab === "popular" ? source : [...source].reverse();
  }, [activeTab, filteredGames, popularReleaseGames]);

  const sidebarGames = listedGames.slice(0, 8);

  const genreBreakdown = useMemo(() => {
    const counts = GAME_CENTER_GAMES.reduce((accumulator, game) => {
      accumulator[game.genre] = (accumulator[game.genre] ?? 0) + 1;
      return accumulator;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([genre, total]) => ({ genre, total }))
      .sort((left, right) => right.total - left.total);
  }, []);

  const topTags = useMemo(() => {
    const counts = GAME_CENTER_GAMES.reduce((accumulator, game) => {
      game.tags.forEach((tag) => {
        accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      });
      return accumulator;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([tag, total]) => ({ tag, total }))
      .sort((left, right) => right.total - left.total)
      .slice(0, 8);
  }, []);

  const aboutStats = useMemo(() => {
    const genreCount = new Set(GAME_CENTER_GAMES.map((game) => game.genre)).size;
    const tagCount = new Set(GAME_CENTER_GAMES.flatMap((game) => game.tags)).size;
    const averageTags =
      GAME_CENTER_GAMES.length > 0
        ? (GAME_CENTER_GAMES.reduce((total, game) => total + game.tags.length, 0) / GAME_CENTER_GAMES.length).toFixed(1)
        : "0";

    return [
      {
        label: "Total Games",
        value: `${GAME_CENTER_GAMES.length}`,
        note: "Playable titles in the GamePi library",
      },
      {
        label: "Genres",
        value: `${genreCount}`,
        note: "Action, puzzle, arcade, music, and more",
      },
      {
        label: "Unique Tags",
        value: `${tagCount}`,
        note: "Searchable keywords across every game",
      },
      {
        label: "Avg. Tags / Game",
        value: averageTags,
        note: "Average metadata depth per title",
      },
    ];
  }, []);

  const aboutHighlights = useMemo(() => {
    const preferredIds: Array<GameCenterEntry["id"]> = [
      "whispering-shadows",
      "pi-defender",
      "pi-piano-tiles",
    ];

    return preferredIds
      .map((id) => GAME_CENTER_GAMES.find((game) => game.id === id))
      .filter((game): game is GameCenterEntry => Boolean(game));
  }, []);

  const scrollCarousel = (distance: number) => {
    carouselRef.current?.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`scrollbar-thin relative h-full overflow-y-auto ${
        isDark
          ? "bg-[#070c15] text-[#e6ecf8]"
          : "bg-[linear-gradient(180deg,#f7fbff,#edf4fc)] text-[#1e2d42]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/20" : "bg-cyan-400/20"
          }`}
        />
        <div
          className={`absolute right-0 top-20 h-80 w-80 rounded-full blur-3xl ${
            isDark ? "bg-violet-500/20" : "bg-indigo-300/25"
          }`}
        />
        <div
          className={`absolute bottom-10 left-1/3 h-72 w-72 rounded-full blur-3xl ${
            isDark ? "bg-amber-500/10" : "bg-amber-300/20"
          }`}
        />
      </div>

      <div className="relative mx-auto min-h-full w-full max-w-[1400px] pb-8">
        <nav
          className={`sticky top-0 z-40 flex min-h-16 flex-wrap items-center gap-3 border-b px-3 py-2 backdrop-blur-xl sm:px-5 ${
            isDark ? "border-cyan-300/10 bg-[#070c15]/90" : "border-[#d5dfec] bg-[#f6faff]/95"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
                isDark ? "border-[#274f22] bg-[#101a12]" : "border-[#b7d5bd] bg-[#eaf7ed]"
              }`}
            >
              <AppIcon name="game-center" className="h-6 w-6" />
            </span>
            <span className={`text-base font-black tracking-[0.14em] sm:text-lg ${isDark ? "text-cyan-300" : "text-[#0f7488]"}`}>
              GAME PI
            </span>
          </div>

          <div className="order-3 flex w-full items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] sm:order-none sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveView("store")}
              className={`rounded-md px-2 py-2 transition ${
                activeView === "store"
                  ? isDark
                    ? "border-b-2 border-cyan-300 text-cyan-300"
                    : "border-b-2 border-[#0f7488] text-[#0f7488]"
                  : isDark
                    ? "text-slate-400 hover:bg-cyan-500/10 hover:text-slate-100"
                    : "text-[#6a7d94] hover:bg-[#ddebfb] hover:text-[#1f3046]"
              }`}
            >
              Store
            </button>
            <button
              type="button"
              onClick={() => setActiveView("about")}
              className={`rounded-md px-2 py-2 transition ${
                activeView === "about"
                  ? isDark
                    ? "border-b-2 border-cyan-300 text-cyan-300"
                    : "border-b-2 border-[#0f7488] text-[#0f7488]"
                  : isDark
                    ? "text-slate-400 hover:bg-cyan-500/10 hover:text-slate-100"
                    : "text-[#6a7d94] hover:bg-[#ddebfb] hover:text-[#1f3046]"
              }`}
            >
              About
            </button>
          </div>

          {activeView === "store" ? (
            <label
              className={`order-2 ml-auto flex w-full items-center overflow-hidden rounded-lg border sm:order-none sm:max-w-[360px] ${
                isDark ? "border-cyan-200/10 bg-white/5" : "border-[#c8d7eb] bg-white/85"
              }`}
            >
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search the store..."
                className={`w-full bg-transparent px-3 py-2 text-sm outline-none ${
                  isDark ? "text-slate-100 placeholder:text-slate-500" : "text-[#1f2f44] placeholder:text-[#7b8da3]"
                }`}
              />
              <span
                className={`flex h-full items-center px-3 py-2 text-xs font-bold ${
                  isDark ? "bg-cyan-400 text-slate-900" : "bg-[#0f7488] text-white"
                }`}
              >
                Search
              </span>
            </label>
          ) : null}
        </nav>

        {activeView === "store" ? (
          <>
            <section className="px-3 pt-6 sm:px-5">
              <h1 className={`mb-4 text-2xl font-black uppercase tracking-[0.08em] sm:text-3xl ${isDark ? "text-white" : "text-[#1b2b40]"}`}>
                Featured and Recommended
              </h1>

              <div className="grid gap-5 md:grid-cols-2">
                {[whisperingShadows, riddles].map((game) =>
                  game ? (
                    <article
                      key={game.id}
                      className={`group relative overflow-hidden rounded-2xl border ${
                        isDark ? "border-cyan-200/15 bg-white/5" : "border-[#ccdbef] bg-white/70"
                      }`}
                    >
                      <img src={game.image} alt={game.title} className="h-full min-h-[220px] w-full object-cover sm:min-h-[240px]" />
                      <div
                        className={`absolute inset-0 ${
                          isDark
                            ? "bg-gradient-to-t from-[#070c15] via-[#070c15]/60 to-transparent"
                            : "bg-gradient-to-t from-[#eff5ff] via-[#eff5ff]/55 to-transparent"
                        }`}
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-end">
                        <div className="min-w-0">
                          <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDark ? "text-cyan-300" : "text-[#0f7488]"}`}>
                            {game.genre}
                          </p>
                          <h2 className={`truncate text-xl font-bold ${isDark ? "text-white" : "text-[#1d3047]"}`}>{game.title}</h2>
                          <p className={`text-sm ${isDark ? "text-slate-300" : "text-[#55677d]"}`}>{game.subtitle}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openApp(game.id)}
                          className={`shrink-0 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                            isDark
                              ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                              : "bg-[#0f7488] text-white hover:bg-[#0d6677]"
                          }`}
                        >
                          Play
                        </button>
                      </div>
                    </article>
                  ) : null,
                )}
              </div>
            </section>

            <section className="px-3 pt-7 sm:px-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className={`text-sm font-black uppercase tracking-[0.16em] ${isDark ? "text-slate-200" : "text-[#42566f]"}`}>
                  Top Picks
                </h3>
                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => scrollCarousel(-420)}
                    className={`h-8 w-8 rounded-full border transition ${
                      isDark
                        ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
                        : "border-[#bdd1e8] bg-[#e7f1fc] text-[#0f7488] hover:bg-[#d6e8fb]"
                    }`}
                  >
                    {"<"}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(420)}
                    className={`h-8 w-8 rounded-full border transition ${
                      isDark
                        ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
                        : "border-[#bdd1e8] bg-[#e7f1fc] text-[#0f7488] hover:bg-[#d6e8fb]"
                    }`}
                  >
                    {">"}
                  </button>
                </div>
              </div>

              <div
                ref={carouselRef}
                className="scrollbar-thin flex gap-4 overflow-x-auto pb-2"
              >
                {topCarouselGames.map((game) => (
                  <article
                    key={game.id}
                    className={`w-[180px] shrink-0 overflow-hidden rounded-xl border sm:w-[230px] ${
                      isDark ? "border-cyan-200/10 bg-[#111828]" : "border-[#ccdbef] bg-white"
                    }`}
                  >
                    <img src={game.image} alt={game.title} className="h-[118px] w-full object-cover sm:h-[128px]" />
                    <div className="space-y-2 p-3">
                      <div className={`truncate text-sm font-bold ${isDark ? "text-slate-100" : "text-[#23364d]"}`}>{game.title}</div>
                      <button
                        type="button"
                        onClick={() => openApp(game.id)}
                        className={`w-full rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                          isDark
                            ? "bg-cyan-400 text-slate-900 hover:bg-cyan-300"
                            : "bg-[#0f7488] text-white hover:bg-[#0d6677]"
                        }`}
                      >
                        Play
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-6 px-3 pt-7 sm:px-5 xl:grid-cols-[1fr_320px]">
              <div>
                <div className={`mb-4 flex flex-wrap items-center gap-1 border-b ${isDark ? "border-cyan-200/10" : "border-[#d4dfef]"}`}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("popular")}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition ${
                      activeTab === "popular"
                        ? isDark
                          ? "border-b-2 border-cyan-300 text-cyan-300"
                          : "border-b-2 border-[#0f7488] text-[#0f7488]"
                        : isDark
                          ? "text-slate-400 hover:text-slate-200"
                          : "text-[#6d7f95] hover:text-[#22364e]"
                    }`}
                  >
                    Popular Releases
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("new")}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition ${
                      activeTab === "new"
                        ? isDark
                          ? "border-b-2 border-cyan-300 text-cyan-300"
                          : "border-b-2 border-[#0f7488] text-[#0f7488]"
                        : isDark
                          ? "text-slate-400 hover:text-slate-200"
                          : "text-[#6d7f95] hover:text-[#22364e]"
                    }`}
                  >
                    New Releases
                  </button>
                </div>

                <div className="space-y-3">
                  {listedGames.map((game) => (
                    <article
                      key={game.id}
                      className={`grid gap-3 rounded-xl border p-3 transition sm:grid-cols-[130px_1fr_auto] ${
                        isDark
                          ? "border-cyan-200/10 bg-white/[0.03] hover:border-cyan-200/20 hover:bg-cyan-500/[0.06]"
                          : "border-[#d4dfef] bg-white/90 hover:border-[#b9cee7] hover:bg-[#eef5ff]"
                      }`}
                    >
                      <img
                        src={game.image}
                        alt={game.title}
                        className="h-[74px] w-full rounded-md object-cover sm:h-full"
                      />
                      <div className="min-w-0">
                        <h4 className={`truncate text-base font-bold ${isDark ? "text-white" : "text-[#1f334b]"}`}>{game.title}</h4>
                        <p className={`text-xs uppercase tracking-[0.11em] ${isDark ? "text-cyan-300" : "text-[#0f7488]"}`}>{game.genre}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {game.tags.slice(0, 4).map((tag) => (
                            <span
                              key={`${game.id}-${tag}`}
                              className={`rounded px-2 py-1 text-[11px] ${
                                isDark ? "bg-white/5 text-slate-300" : "bg-[#eef4fd] text-[#52657d]"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => openApp(game.id)}
                          className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                            isDark
                              ? "bg-cyan-400 text-slate-900 hover:bg-cyan-300"
                              : "bg-[#0f7488] text-white hover:bg-[#0d6677]"
                          }`}
                        >
                          Play
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside>
                <section
                  className={`overflow-hidden rounded-xl border ${
                    isDark ? "border-cyan-200/10 bg-white/[0.03]" : "border-[#d4dfef] bg-white/90"
                  }`}
                >
                  <header
                    className={`border-b px-4 py-3 text-xs font-black uppercase tracking-[0.16em] ${
                      isDark
                        ? "border-cyan-200/10 bg-cyan-400/[0.08] text-slate-300"
                        : "border-[#d4dfef] bg-[#eaf3ff] text-[#48607a]"
                    }`}
                  >
                    Quick Play
                  </header>
                  <div className="grid grid-cols-2 gap-3 p-3">
                    {sidebarGames.map((game) => (
                      <article
                        key={`sidebar-${game.id}`}
                        className={`overflow-hidden rounded-lg border ${
                          isDark ? "border-cyan-200/10 bg-[#111828]" : "border-[#d4dfef] bg-[#f9fbff]"
                        }`}
                      >
                        <img
                          src={game.image}
                          alt={game.title}
                          className="h-20 w-full object-cover"
                        />
                        <div className="space-y-2 p-2">
                          <div className={`truncate text-[11px] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-slate-200" : "text-[#324a64]"}`}>
                            {game.title}
                          </div>
                          <button
                            type="button"
                            onClick={() => openApp(game.id)}
                            className={`w-full rounded px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition ${
                              isDark
                                ? "bg-cyan-400 text-slate-900 hover:bg-cyan-300"
                                : "bg-[#0f7488] text-white hover:bg-[#0d6677]"
                            }`}
                          >
                            Play
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </aside>
            </section>

            {filteredGames.length === 0 ? (
              <section className="px-3 pt-6 sm:px-5">
                <div
                  className={`rounded-xl border border-dashed px-6 py-10 text-center ${
                    isDark
                      ? "border-cyan-300/30 bg-cyan-500/[0.04]"
                      : "border-[#9cc3e6] bg-[#edf5ff]"
                  }`}
                >
                  <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-[#1e344f]"}`}>No games matched your search</h3>
                  <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-[#5b6f87]"}`}>
                    Try a different title, genre, or tag.
                  </p>
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <section className="px-3 pt-6 sm:px-5">
            <div
              className={`rounded-2xl border p-4 sm:p-6 ${
                isDark ? "border-cyan-200/15 bg-white/[0.03]" : "border-[#d4dfef] bg-white/90"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className={`text-xs font-black uppercase tracking-[0.16em] ${isDark ? "text-cyan-300" : "text-[#0f7488]"}`}>
                    About GamePi
                  </p>
                  <h2 className={`mt-2 text-2xl font-black tracking-[0.05em] sm:text-3xl ${isDark ? "text-white" : "text-[#1a2f49]"}`}>
                    Built for quick play and discovery
                  </h2>
                  <p className={`mt-3 text-sm leading-relaxed sm:text-base ${isDark ? "text-slate-300" : "text-[#566980]"}`}>
                    GamePi is the game hub inside this desktop experience. It focuses on instant launch titles,
                    lightweight gameplay, and easy discovery with search, tags, and curated sections.
                    Every card below is generated from the same in-app library data used by the store.
                  </p>
                </div>
                <div
                  className={`rounded-xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] ${
                    isDark
                      ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-200"
                      : "border-[#bdd4ea] bg-[#eaf3ff] text-[#2f5470]"
                  }`}
                >
                  Version 3.14.159 pi
                </div>
              </div>

              <div className="mt-6 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
                {aboutStats.map((stat) => (
                  <article
                    key={stat.label}
                    className={`rounded-xl border px-4 py-3 ${
                      isDark ? "border-cyan-200/10 bg-[#111828]" : "border-[#d4dfef] bg-[#f9fbff]"
                    }`}
                  >
                    <div className={`text-[11px] font-black uppercase tracking-[0.14em] ${isDark ? "text-slate-400" : "text-[#788ba2]"}`}>
                      {stat.label}
                    </div>
                    <div className={`mt-2 text-2xl font-black ${isDark ? "text-white" : "text-[#1d334f]"}`}>{stat.value}</div>
                    <div className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-[#667b94]"}`}>{stat.note}</div>
                  </article>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <section
                  className={`rounded-xl border p-4 ${
                    isDark ? "border-cyan-200/10 bg-[#111828]" : "border-[#d4dfef] bg-[#f9fbff]"
                  }`}
                >
                  <h3 className={`text-sm font-black uppercase tracking-[0.14em] ${isDark ? "text-cyan-300" : "text-[#0f7488]"}`}>
                    Featured Data
                  </h3>
                  <div className="mt-3 space-y-3">
                    {aboutHighlights.map((game) => (
                      <article
                        key={`about-${game.id}`}
                        className={`grid gap-3 rounded-lg border p-2.5 sm:grid-cols-[120px_1fr] ${
                          isDark ? "border-cyan-300/10 bg-white/[0.02]" : "border-[#d4dfef] bg-white"
                        }`}
                      >
                        <img src={game.image} alt={game.title} className="h-20 w-full rounded-md object-cover" />
                        <div className="min-w-0">
                          <div className={`text-xs font-bold uppercase tracking-[0.14em] ${isDark ? "text-cyan-300" : "text-[#0f7488]"}`}>
                            {game.genre}
                          </div>
                          <div className={`truncate text-sm font-bold ${isDark ? "text-slate-100" : "text-[#22374f]"}`}>{game.title}</div>
                          <p className={`mt-1 text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-[#627791]"}`}>{game.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <article
                    className={`rounded-xl border p-4 ${
                      isDark ? "border-cyan-200/10 bg-[#111828]" : "border-[#d4dfef] bg-[#f9fbff]"
                    }`}
                  >
                    <h3 className={`text-sm font-black uppercase tracking-[0.14em] ${isDark ? "text-cyan-300" : "text-[#0f7488]"}`}>
                      Genre Breakdown
                    </h3>
                    <div className="mt-3 space-y-2">
                      {genreBreakdown.map((item) => (
                        <div
                          key={`genre-${item.genre}`}
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-xs ${
                            isDark ? "bg-white/[0.03] text-slate-300" : "bg-white text-[#445a74]"
                          }`}
                        >
                          <span>{item.genre}</span>
                          <span className={`font-black ${isDark ? "text-white" : "text-[#1d344f]"}`}>{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article
                    className={`rounded-xl border p-4 ${
                      isDark ? "border-cyan-200/10 bg-[#111828]" : "border-[#d4dfef] bg-[#f9fbff]"
                    }`}
                  >
                    <h3 className={`text-sm font-black uppercase tracking-[0.14em] ${isDark ? "text-cyan-300" : "text-[#0f7488]"}`}>
                      Popular Tags
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topTags.map((item) => (
                        <span
                          key={`about-tag-${item.tag}`}
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                            isDark
                              ? "border-cyan-200/20 bg-cyan-400/10 text-cyan-100"
                              : "border-[#c6d8ed] bg-white text-[#3d5774]"
                          }`}
                        >
                          {item.tag} ({item.total})
                        </span>
                      ))}
                    </div>
                  </article>
                </section>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
