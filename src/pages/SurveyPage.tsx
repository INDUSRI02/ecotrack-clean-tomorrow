import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Camera, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

const surveyQuestions = [
  { q: "How often is waste collected in your area?", options: ["Daily", "Weekly", "Monthly", "Rarely"] },
  { q: "Do you segregate waste at home?", options: ["Always", "Sometimes", "Rarely", "Never"] },
  { q: "Are you satisfied with local waste management?", options: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied"] },
  { q: "What waste issue concerns you most?", options: ["Littering", "No bins available", "Irregular collection", "Lack of awareness"] },
];

const SurveyPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < surveyQuestions.length) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `surveys/${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("uploads").upload(path, imageFile);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
          imageUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from("surveys").insert({
        user_id: user.id,
        answers: answers as any,
        image_url: imageUrl,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pb-24 safe-top">
        <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold text-primary-foreground">Survey</h1>
        </div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="px-4 mt-8">
          <div className="glass-card p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground">Thank You!</h2>
            <p className="text-muted-foreground mt-2">Your response has been recorded.</p>
            <Button variant="eco" className="mt-6 rounded-xl" onClick={() => navigate("/dashboard")}>Back to Home</Button>
          </div>
        </motion.div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-primary-foreground">Survey</h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {surveyQuestions.map((sq, qi) => (
          <motion.div key={qi} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.08 }} className="glass-card p-5">
            <h3 className="font-semibold text-foreground mb-3">{sq.q}</h3>
            <div className="space-y-2">
              {sq.options.map((opt) => (
                <button key={opt} onClick={() => setAnswers({ ...answers, [qi]: opt })} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${answers[qi] === opt ? "eco-gradient text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Image Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-3">📷 Attach a photo (optional)</h3>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-cover rounded-xl" />
              <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-foreground/50 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
            </div>
          ) : (
            <Button variant="outline" className="w-full h-12 rounded-xl gap-2" onClick={() => fileRef.current?.click()}>
              <Camera className="w-4 h-4" /> Upload Photo
            </Button>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])} />
        </motion.div>

        <Button variant="eco" className="w-full h-12 rounded-xl" onClick={handleSubmit} disabled={Object.keys(answers).length < surveyQuestions.length || submitting}>
          {submitting ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : "Submit Survey"}
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default SurveyPage;
