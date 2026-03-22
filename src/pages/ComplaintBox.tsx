import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Send, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

const ComplaintBox = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const { data } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
    setComplaints(data || []);
    setLoading(false);
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `complaints/${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("uploads").upload(path, imageFile);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
          imageUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from("complaints").insert({
        user_id: user.id,
        title,
        description,
        image_url: imageUrl,
      });
      if (error) throw error;

      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      loadComplaints();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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

          {imagePreview && (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-cover rounded-xl" />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-foreground/50 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])} />

          <div className="flex gap-3">
            <Button type="button" variant="outline" size="icon" className="h-12 w-12 rounded-xl" onClick={() => fileRef.current?.click()}>
              <Camera className="w-5 h-5" />
            </Button>
            <Button type="submit" variant="eco" className="flex-1 h-12 rounded-xl" disabled={submitting}>
              {submitting ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Submit</>}
            </Button>
          </div>
        </motion.form>

        <h2 className="text-lg font-bold text-foreground mt-6 mb-3">History</h2>
        {loading ? (
          <div className="text-center py-8"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No complaints yet</div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                    {c.image_url && (
                      <img src={c.image_url} alt="" className="mt-2 rounded-lg max-h-32 object-cover" />
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{new Date(c.created_at).toLocaleDateString()}</p>
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
