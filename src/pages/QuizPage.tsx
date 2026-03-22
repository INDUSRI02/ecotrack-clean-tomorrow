import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const questions = [
  { q: "Which waste type does banana peel belong to?", options: ["Dry Waste", "Wet Waste", "Recyclable", "Hazardous"], answer: 1 },
  { q: "What color bin is typically used for dry waste?", options: ["Green", "Blue", "Red", "Yellow"], answer: 1 },
  { q: "Which of these is recyclable?", options: ["Food scraps", "Plastic bottles", "Soiled napkins", "Medical waste"], answer: 1 },
  { q: "Composting is a process for which type of waste?", options: ["E-waste", "Dry waste", "Wet/organic waste", "Plastic"], answer: 2 },
  { q: "What should you do with old batteries?", options: ["Throw in regular bin", "Burn them", "Take to e-waste center", "Bury underground"], answer: 2 },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].answer) setScore((s) => s + 1);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
        const scores = JSON.parse(localStorage.getItem("ecotrack_quiz_scores") || "[]");
        scores.push({ score: score + (idx === questions[current].answer ? 1 : 0), total: questions.length, date: new Date().toISOString() });
        localStorage.setItem("ecotrack_quiz_scores", JSON.stringify(scores));
      }
    }, 1000);
  };

  const restart = () => { setCurrent(0); setScore(0); setSelected(null); setFinished(false); };

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-primary-foreground">Eco Quiz</h1>
        {!finished && <span className="ml-auto text-primary-foreground/80 text-sm">{current + 1}/{questions.length}</span>}
      </div>

      <div className="px-4 mt-6">
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 text-center">
              <Trophy className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>
              <p className="text-4xl font-extrabold eco-gradient-text mt-2">{score}/{questions.length}</p>
              <p className="text-muted-foreground mt-2">{score >= 4 ? "Excellent! 🌟" : score >= 2 ? "Good job! 💪" : "Keep learning! 📚"}</p>
              <Button variant="eco" className="mt-6 rounded-xl" onClick={restart}>Try Again</Button>
            </motion.div>
          ) : (
            <motion.div key={current} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">{questions[current].q}</h2>
              <div className="space-y-3">
                {questions[current].options.map((opt, idx) => {
                  let style = "bg-muted text-foreground";
                  if (selected !== null) {
                    if (idx === questions[current].answer) style = "bg-secondary text-secondary-foreground";
                    else if (idx === selected) style = "bg-destructive/20 text-destructive";
                  }
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(idx)}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all ${style}`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
};

export default QuizPage;
