import { motion } from "framer-motion";
import { ArrowLeft, Droplets, Sun, Recycle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const sections = [
  {
    title: "Wet Waste",
    icon: Droplets,
    color: "from-secondary to-secondary/70",
    examples: ["Food scraps", "Vegetable peels", "Leftover cooked food", "Tea leaves & coffee grounds", "Eggshells"],
    dos: ["Separate before disposing", "Compost if possible"],
    donts: ["Don't mix with dry waste", "Don't store for too long"],
  },
  {
    title: "Dry Waste",
    icon: Sun,
    color: "from-primary to-primary/70",
    examples: ["Paper & cardboard", "Plastic bottles", "Metal cans", "Glass jars", "Cloth & fabric"],
    dos: ["Clean before disposal", "Flatten cardboard boxes"],
    donts: ["Don't contaminate with food", "Don't mix hazardous items"],
  },
  {
    title: "Recyclable Waste",
    icon: Recycle,
    color: "from-primary to-secondary",
    examples: ["Newspapers", "PET bottles", "Aluminum cans", "Glass containers", "Old electronics"],
    dos: ["Rinse containers", "Remove labels if possible"],
    donts: ["Don't include broken glass unsafely", "Don't mix with organic waste"],
  },
];

const WasteSegregation = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-primary-foreground">Waste Segregation</h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {sections.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{s.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-2">Examples:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {s.examples.map((ex) => (
                <span key={ex} className="text-xs bg-muted px-3 py-1 rounded-full text-foreground">{ex}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-secondary mb-1">✅ Do's</p>
                {s.dos.map((d) => <p key={d} className="text-muted-foreground">• {d}</p>)}
              </div>
              <div>
                <p className="font-semibold text-destructive mb-1">❌ Don'ts</p>
                {s.donts.map((d) => <p key={d} className="text-muted-foreground">• {d}</p>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default WasteSegregation;
