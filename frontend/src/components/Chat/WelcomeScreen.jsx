import { Film, Sparkles, Popcorn, Rocket, Brain, Heart, Trophy, Gem, Video } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: Film,
    title: "Recommend a movie",
    query: "Recommend a great movie for me",
    desc: "Personalized movie picks for any vibe",
    color: "from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30",
  },
  {
    icon: Popcorn,
    title: "Movies for tonight",
    query: "What are some good movies to watch tonight?",
    desc: "Fun & entertaining evening watchlist",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
  },
  {
    icon: Rocket,
    title: "Best sci-fi movies",
    query: "Find me top rated sci-fi movies",
    desc: "Mind-bending space & futuristic films",
    color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    icon: Brain,
    title: "Psychological thrillers",
    query: "Recommend intense psychological thrillers",
    desc: "Twisted plots & suspenseful cinema",
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
  },
  {
    icon: Heart,
    title: "Romance & Drama",
    query: "Suggest high rated romance movies",
    desc: "Heartwarming and emotional stories",
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
  },
  {
    icon: Trophy,
    title: "Oscar winners",
    query: "Best Oscar winning movies of all time",
    desc: "Critically acclaimed award winners",
    color: "from-yellow-500/20 to-amber-600/20 text-yellow-400 border-yellow-500/30",
  },
  {
    icon: Gem,
    title: "Hidden gems",
    query: "Underrated hidden gem movies",
    desc: "Underrated masterpieces you missed",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    icon: Video,
    title: "Directed by Nolan",
    query: "Movies directed by Christopher Nolan",
    desc: "Cinematic epics from Christopher Nolan",
    color: "from-slate-500/20 to-indigo-500/20 text-indigo-300 border-indigo-500/30",
  },
];

export default function WelcomeScreen({ onSelectQuery }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 text-center animate-fade-in max-w-4xl mx-auto">
      {/* Glow Emblem */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 via-red-600 to-amber-500 flex items-center justify-center text-white shadow-2xl shadow-orange-950/60 border border-white/20">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit mb-2">
        What do you want to watch?
      </h1>
      <p className="text-sm sm:text-base text-slate-400 max-w-md mb-8 font-medium">
        Your intelligent AI cinema guide. Ask MovieChat for recommendations, genres, directors, or moods.
      </p>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {SUGGESTIONS.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectQuery(item.query)}
              className="group p-4 rounded-2xl bg-[#171a26] border border-white/10 hover:border-orange-500/40 hover:bg-[#1f2334] text-left transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-orange-950/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-orange-400 transition-colors">
                  ASK →
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors font-outfit">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
