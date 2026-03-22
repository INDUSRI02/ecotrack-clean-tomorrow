import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import BottomNav from "@/components/BottomNav";

const COLORS = ["hsl(210, 79%, 46%)", "hsl(128, 52%, 33%)", "hsl(200, 60%, 60%)", "hsl(0, 84%, 60%)"];

const ReportsPage = () => {
  const navigate = useNavigate();

  const complaints = JSON.parse(localStorage.getItem("ecotrack_complaints") || "[]");
  const quizScores = JSON.parse(localStorage.getItem("ecotrack_quiz_scores") || "[]");
  const surveys = JSON.parse(localStorage.getItem("ecotrack_surveys") || "[]");

  const barData = [
    { name: "Complaints", value: complaints.length },
    { name: "Quizzes", value: quizScores.length },
    { name: "Surveys", value: surveys.length },
  ];

  const pendingCount = complaints.filter((c: any) => c.status === "Pending").length;
  const resolvedCount = complaints.filter((c: any) => c.status === "Resolved").length;
  const pieData = [
    { name: "Pending", value: pendingCount || 1 },
    { name: "Resolved", value: resolvedCount || 0 },
  ];

  const avgScore = quizScores.length > 0
    ? (quizScores.reduce((a: number, s: any) => a + s.score, 0) / quizScores.length).toFixed(1)
    : "N/A";

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-primary-foreground">Reports</h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {barData.map((d, i) => (
            <motion.div key={d.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold eco-gradient-text">{d.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{d.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Activity Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Complaint Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Avg quiz */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5 text-center">
          <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
          <p className="text-3xl font-bold eco-gradient-text mt-1">{avgScore}</p>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ReportsPage;
