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
  deleteThought: (id: string, adminKey: string) => Promise<void>;
}

const ThoughtsContext = createContext<ThoughtsContextType | null>(null);

export function ThoughtsProvider({ children }: { children: ReactNode }) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API);
        if (res.status === 404) { setThoughts([]); return; }
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data: Thought[] = await res.json();
        setThoughts(data.map((t) => ({ ...t, createdAt: new Date(t.createdAt) })));
      } catch (e) {
        if (e instanceof TypeError && e.message.includes("fetch")) {
          setThoughts([]);
        } else {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addThought = async (
    data: Omit<Thought, "id" | "createdAt" | "x" | "y" | "rotation">
  ) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);

    if (!res || res.status === 404) {
      const local: Thought = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        x: Math.random() * 60 + 5,
        y: Math.random() * 55 + 5,
        rotation: (Math.random() - 0.5) * 12,
      };
      setThoughts((prev) => [local, ...prev]);
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Failed to save thought");
    }

    const saved: Thought = await res.json();
    setThoughts((prev) => [
      { ...saved, createdAt: new Date(saved.createdAt) },
      ...prev,
    ]);
  };

  const deleteThought = async (id: string, adminKey: string) => {
    const res = await fetch(API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Failed to delete thought");
    }

    // Remove from local state immediately
    setThoughts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ThoughtsContext.Provider value={{ thoughts, loading, error, addThought, deleteThought }}>
      {children}
    </ThoughtsContext.Provider>
  );
}

export function useThoughts() {
  const ctx = useContext(ThoughtsContext);
  if (!ctx) throw new Error("useThoughts must be used inside ThoughtsProvider");
  return ctx;
}