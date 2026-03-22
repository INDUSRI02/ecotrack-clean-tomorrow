import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const surveyQuestions = [
  { q: "How often is waste collected in your area?", options: ["Daily", "Weekly", "Monthly", "Rarely"] },
  { q: "Do you segregate waste at home?", options: ["Always", "Sometimes", "Rarely", "Never"] },
  { q: "Are you satisfied with local waste management?", options: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied"] },
  { q: "What waste issue concerns you most?", options: ["Littering", "No bins available", "Irregular collection", "Lack of awareness"] },
];

const SurveyPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(answers).length < surveyQuestions.length) return;
    const surveys = JSON.parse(localStorage.getItem("ecotrack_surveys") || "[]");
    surveys.push({ answers, date: new Date().toISOString() });
    localStorage.setItem("ecotrack_surveys", JSON.stringify(surveys));
    setSubmitted(true);
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
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [qi]: opt })}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${answers[qi] === opt ? "eco-gradient text-primary-foreground" : "bg-muted text-foreground"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        <Button variant="eco" className="w-full h-12 rounded-xl" onClick={handleSubmit} disabled={Object.keys(answers).length < surveyQuestions.length}>
          Submit Survey
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default SurveyPage;
