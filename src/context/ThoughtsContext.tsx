import { createContext, useContext, useState, type ReactNode } from "react";
import { type Thought } from "../types/thought";

interface ThoughtsContextType {
  thoughts: Thought[];
  addThought: (thought: Omit<Thought, "id" | "createdAt" | "x" | "y" | "rotation">) => void;
}

const ThoughtsContext = createContext<ThoughtsContextType | null>(null);

export function ThoughtsProvider({ children }: { children: ReactNode }) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  const addThought = (data: Omit<Thought, "id" | "createdAt" | "x" | "y" | "rotation">) => {
    const newThought: Thought = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      x: Math.random() * 60 + 5,   // 5%–65% from left
      y: Math.random() * 55 + 5,   // 5%–60% from top
      rotation: (Math.random() - 0.5) * 12, // –6° to +6°
    };
    setThoughts((prev) => [...prev, newThought]);
  };

  return (
    <ThoughtsContext.Provider value={{ thoughts, addThought }}>
      {children}
    </ThoughtsContext.Provider>
  );
}

export function useThoughts() {
  const ctx = useContext(ThoughtsContext);
  if (!ctx) throw new Error("useThoughts must be used inside ThoughtsProvider");
  return ctx;
}
