import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Users, MessageSquareWarning, ClipboardList, BarChart3, LogOut, CheckCircle2, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(210, 79%, 46%)", "hsl(128, 52%, 33%)", "hsl(200, 60%, 60%)", "hsl(0, 84%, 60%)"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [quizScores, setQuizScores] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "complaints" | "surveys" | "users">("overview");

  useEffect(() => {
    checkAdmin();
    loadData();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin", { replace: true }); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roles || roles.length === 0) { navigate("/admin", { replace: true }); }
  };

  const loadData = async () => {
    const [c, s, q, p] = await Promise.all([
      supabase.from("complaints").select("*").order("created_at", { ascending: false }),
      supabase.from("surveys").select("*").order("created_at", { ascending: false }),
      supabase.from("quiz_scores").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
    ]);
    setComplaints(c.data || []);
    setSurveys(s.data || []);
    setQuizScores(q.data || []);
    setProfiles(p.data || []);
    setLoading(false);
  };

  const updateComplaintStatus = async (id: string, status: string) => {
    await supabase.from("complaints").update({ status }).eq("id", id);
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin", { replace: true });
  };

  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  const barData = [
    { name: "Complaints", value: complaints.length },
    { name: "Surveys", value: surveys.length },
    { name: "Quizzes", value: quizScores.length },
    { name: "Users", value: profiles.length },
  ];

  const pieData = [
    { name: "Pending", value: pendingCount || 0 },
    { name: "Resolved", value: resolvedCount || 0 },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const tabs = [
    { key: "overview", icon: BarChart3, label: "Overview" },
    { key: "complaints", icon: MessageSquareWarning, label: "Complaints" },
    { key: "surveys", icon: ClipboardList, label: "Surveys" },
    { key: "users", icon: Users, label: "Users" },
  ] as const;

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary-foreground" />
          <h1 className="text-xl font-bold text-primary-foreground">Admin Dashboard</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/20">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? "eco-gradient text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {barData.map((d, i) => (
                <motion.div key={d.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold eco-gradient-text">{d.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{d.name}</p>
                </motion.div>
              ))}
            </div>

            <div className="glass-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Activity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Complaint Status</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" label>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab === "complaints" && (
          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No complaints yet</div>
            ) : complaints.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                    {c.image_url && <img src={c.image_url} alt="" className="mt-2 rounded-lg max-h-32 object-cover" />}
                    <p className="text-xs text-muted-foreground mt-2">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${c.status === "Pending" ? "bg-accent text-accent-foreground" : "bg-secondary/20 text-secondary"}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {c.status === "Pending" && (
                    <Button size="sm" variant="eco" className="rounded-lg gap-1 text-xs" onClick={() => updateComplaintStatus(c.id, "Resolved")}>
                      <CheckCircle2 className="w-3 h-3" /> Resolve
                    </Button>
                  )}
                  {c.status === "Resolved" && (
                    <Button size="sm" variant="outline" className="rounded-lg gap-1 text-xs" onClick={() => updateComplaintStatus(c.id, "Pending")}>
                      <Clock className="w-3 h-3" /> Reopen
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "surveys" && (
          <div className="space-y-3">
            {surveys.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No surveys yet</div>
            ) : surveys.map((s) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <p className="text-xs text-muted-foreground mb-2">{new Date(s.created_at).toLocaleDateString()}</p>
                {s.image_url && <img src={s.image_url} alt="" className="rounded-lg max-h-40 object-cover mb-2" />}
                {Object.entries(s.answers as Record<string, string>).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground">Q{Number(k) + 1}</span>
                    <span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-3">
            {profiles.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full eco-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {(p.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground">{p.name || "No name"}</p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
