import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import { Recycle, MessageSquareWarning, Lightbulb, Brain, ClipboardList, BarChart3, Bell, ScanSearch } from "lucide-react";

const cards = [
  { icon: Recycle, label: "Waste Segregation", path: "/waste-segregation", gradient: "from-primary to-secondary" },
  { icon: ScanSearch, label: "AI Classifier", path: "/classifier", gradient: "from-primary to-eco-green" },
  { icon: MessageSquareWarning, label: "Complaint Box", path: "/complaints", gradient: "from-primary to-accent" },
  { icon: Lightbulb, label: "Tips & Awareness", path: "/tips", gradient: "from-secondary to-eco-green" },
  { icon: Brain, label: "Quiz", path: "/quiz", gradient: "from-primary to-primary/70" },
  { icon: ClipboardList, label: "Survey", path: "/survey", gradient: "from-secondary to-secondary/70" },
  { icon: BarChart3, label: "Reports", path: "/reports", gradient: "from-primary to-secondary" },
  { icon: Bell, label: "Alerts", path: "/alerts", gradient: "from-accent-foreground to-primary" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-12 rounded-b-[2rem]">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <p className="text-primary-foreground/70 text-sm">Welcome back</p>
          <h1 className="text-2xl font-bold text-primary-foreground">
            Hello, {user?.name || "User"} 👋
          </h1>
        </motion.div>
      </div>

      <div className="px-4 -mt-6">
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <motion.button
              key={card.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(card.path)}
              className="glass-card p-5 flex flex-col items-center gap-3 text-center active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md`}>
                <card.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">{card.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
