import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Thought } from "../types/thought";

const API = "/api/thoughts";

interface ThoughtsContextType {
  thoughts: Thought[];
  loading: boolean;
  error: string | null;
  addThought: (
    data: Omit<Thought, "id" | "createdAt" | "x" | "y" | "rotation">
  ) => Promise<void>;
}

const ThoughtsContext = createContext<ThoughtsContextType | null>(null);

export function ThoughtsProvider({ children }: { children: ReactNode }) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState<string | null>(null);

  // ── Load all thoughts on first render ──────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Failed to fetch thoughts");
        const data: Thought[] = await res.json();
        setThoughts(data.map((t) => ({ ...t, createdAt: new Date(t.createdAt) })));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Add a new thought — POSTs to API, then updates local state ─────────
  const addThought = async (
    data: Omit<Thought, "id" | "createdAt" | "x" | "y" | "rotation">
  ) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to save thought");
    }

    const saved: Thought = await res.json();
    setThoughts((prev) => [
      { ...saved, createdAt: new Date(saved.createdAt) },
      ...prev,
    ]);
  };

  return (
    <ThoughtsContext.Provider value={{ thoughts, loading, error, addThought }}>
      {children}
    </ThoughtsContext.Provider>
  );
}

export function useThoughts() {
  const ctx = useContext(ThoughtsContext);
  if (!ctx) throw new Error("useThoughts must be used inside ThoughtsProvider");
  return ctx;
}