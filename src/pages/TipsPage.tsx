import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Recycle, Sparkles, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const categories = [
  { key: "recycling", label: "Recycling", icon: Recycle },
  { key: "hygiene", label: "Hygiene", icon: Sparkles },
  { key: "reduction", label: "Waste Reduction", icon: Leaf },
];

const tipsData: Record<string, { title: string; tip: string }[]> = {
  recycling: [
    { title: "Sort Your Waste", tip: "Separate plastics, metals, paper, and glass into different bins for effective recycling." },
    { title: "Rinse Containers", tip: "Always rinse food containers before recycling to avoid contamination." },
    { title: "Check Labels", tip: "Look for recycling symbols on packaging to know what can be recycled." },
    { title: "E-Waste Disposal", tip: "Take old electronics to certified e-waste recyclers instead of regular bins." },
  ],
  hygiene: [
    { title: "Sealed Disposal", tip: "Always seal waste bags properly before putting them out for collection." },
    { title: "Clean Bins Regularly", tip: "Wash your waste bins at least once a week with disinfectant." },
    { title: "Sanitary Waste", tip: "Wrap sanitary waste separately in newspaper before disposal." },
  ],
  reduction: [
    { title: "Carry Reusable Bags", tip: "Avoid single-use plastic by always carrying reusable bags when shopping." },
    { title: "Compost at Home", tip: "Start a compost pit for kitchen waste to create natural fertilizer." },
    { title: "Buy in Bulk", tip: "Reduce packaging waste by buying groceries in bulk quantities." },
    { title: "Say No to Straws", tip: "Use metal or bamboo straws instead of plastic ones." },
  ],
};

const TipsPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("recycling");

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-primary-foreground">Tips & Awareness</h1>
      </div>

      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active === cat.key ? "eco-gradient text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {tipsData[active].map((tip, i) => (
            <motion.div key={tip.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4">
              <h3 className="font-semibold text-foreground">{tip.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{tip.tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default TipsPage;
