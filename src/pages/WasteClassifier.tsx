import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Upload, Loader2, Leaf, Droplets, Recycle, AlertTriangle, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

const classificationIcons: Record<string, any> = {
  "Dry Waste": Leaf,
  "Wet Waste": Droplets,
  "Recyclable Waste": Recycle,
  "Hazardous Waste": AlertTriangle,
  "E-Waste": Cpu,
};

const classificationColors: Record<string, string> = {
  "Dry Waste": "from-primary to-primary/70",
  "Wet Waste": "from-secondary to-secondary/70",
  "Recyclable Waste": "from-primary to-secondary",
  "Hazardous Waste": "from-destructive to-destructive/70",
  "E-Waste": "from-accent-foreground to-primary",
};

interface ClassifyResult {
  classification: string;
  item: string;
  confidence: string;
  tips: string;
  details: string;
}

const WasteClassifier = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassifyResult | null>(null);
  const [error, setError] = useState("");

  const handleFile = (file: File) => {
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const classify = async () => {
    if (!preview) return;
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("classify-waste", {
        body: { imageBase64: preview },
      });
      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Classification failed");
    } finally {
      setLoading(false);
    }
  };

  const Icon = result ? classificationIcons[result.classification] || Leaf : null;
  const gradient = result ? classificationColors[result.classification] || "from-primary to-secondary" : "";

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <div className="eco-gradient px-6 pt-8 pb-6 rounded-b-[2rem] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-xl font-bold text-primary-foreground">AI Waste Classifier</h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 text-center">
          <p className="text-sm text-muted-foreground mb-4">Take a photo or upload an image to identify the waste type</p>

          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded-xl" />
              <button onClick={() => { setPreview(null); setResult(null); }} className="absolute top-2 right-2 bg-foreground/50 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">✕</button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Tap to upload an image</p>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2" onClick={() => fileRef.current?.click()}>
              <Camera className="w-4 h-4" /> {preview ? "Change" : "Upload"}
            </Button>
            {preview && (
              <Button variant="eco" className="flex-1 h-12 rounded-xl gap-2" onClick={classify} disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Classify"}
              </Button>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 text-center text-destructive text-sm">
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                {Icon && <Icon className="w-7 h-7 text-primary-foreground" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{result.classification}</h2>
                <p className="text-sm text-muted-foreground">{result.item}</p>
              </div>
              <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${result.confidence === "High" ? "bg-secondary/20 text-secondary" : "bg-accent text-accent-foreground"}`}>
                {result.confidence}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-muted/50 p-3 rounded-xl">
                <p className="font-medium text-foreground mb-1">💡 Disposal Tip</p>
                <p className="text-muted-foreground">{result.tips}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-xl">
                <p className="font-medium text-foreground mb-1">📋 Details</p>
                <p className="text-muted-foreground">{result.details}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default WasteClassifier;
