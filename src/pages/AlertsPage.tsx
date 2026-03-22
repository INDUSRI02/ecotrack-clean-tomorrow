import { motion } from "framer-motion";
import { ArrowLeft, Bell, Truck, Sparkles, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const alerts = [
  { icon: Truck, title: "Waste Collection Tomorrow", desc: "Municipal truck arrives at 8:00 AM. Keep your bins ready.", time: "2 hours ago", color: "from-primary to-primary/70" },
  { icon: Sparkles, title: "Cleanliness Drive – Sunday", desc: "Join the community cleanup event at Central Park.", time: "1 day ago", color: "from-secondary to-secondary/70" },
  { icon: Info, title: "New Recycling Guidelines", desc: "Updated rules for plastic segregation. Tap to learn more.", time: "3 days ago", color: "from-primary to-secondary" },
  { icon: Bell, title: "Survey Reminder", desc: "Complete the monthly waste management survey.", time: "5 days ago", color: "from-accent-foreground to-primary" },
];

const AlertsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-primary-foreground">Alerts</h1>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {alerts.map((alert, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4 flex gap-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${alert.color} flex items-center justify-center shrink-0`}>
              <alert.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">{alert.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{alert.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default AlertsPage;
