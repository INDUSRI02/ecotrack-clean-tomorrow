import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BottomNav from "@/components/BottomNav";

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "Resolved";
  date: string;
}

const ComplaintBox = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    return JSON.parse(localStorage.getItem("ecotrack_complaints") || "[]");
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const newComplaint: Complaint = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem("ecotrack_complaints", JSON.stringify(updated));
    setTitle("");
    setDescription("");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-primary-foreground">Complaint Box</h1>
      </div>

      <div className="px-4 mt-4">
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card p-5 space-y-4">
          <Input placeholder="Complaint Title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-0" />
          <Textarea placeholder="Describe the issue..." value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl bg-muted/50 border-0 min-h-[100px]" />
          <div className="flex gap-3">
            <Button type="button" variant="outline" size="icon" className="h-12 w-12 rounded-xl">
              <Camera className="w-5 h-5" />
            </Button>
            <Button type="submit" variant="eco" className="flex-1 h-12 rounded-xl" disabled={submitting}>
              {submitting ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Submit</>}
            </Button>
          </div>
        </motion.form>

        <h2 className="text-lg font-bold text-foreground mt-6 mb-3">History</h2>
        {complaints.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No complaints yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.status === "Pending" ? "bg-accent text-accent-foreground" : "bg-secondary/20 text-secondary"}`}>
                    {c.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ComplaintBox;
