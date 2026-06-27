import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Rant } from "../types/rant";

const API = "/api/rants";

interface RantContextType {
  rants: Rant[];
  loading: boolean;
  error: string | null;
  addRant: (data: Omit<Rant, "id" | "createdAt">) => Promise<Rant>;
  deleteRant: (id: string, adminKey: string) => Promise<void>; // Added this line
}

const RantContext = createContext<RantContextType | null>(null);

export function RantProvider({ children }: { children: ReactNode }) {
  const [rants,   setRants  ] = useState<Rant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API);
        if (res.status === 404) { setRants([]); return; }
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data: Rant[] = await res.json();
        setRants(data.map((r) => ({ ...r, createdAt: new Date(r.createdAt) })));
      } catch (e) {
        if (e instanceof TypeError && e.message.includes("fetch")) setRants([]);
        else setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addRant = async (data: Omit<Rant, "id" | "createdAt">): Promise<Rant> => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);

    if (!res || res.status === 404) {
      const local: Rant = { ...data, id: crypto.randomUUID(), createdAt: new Date() };
      setRants((prev) => [local, ...prev]);
      return local;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Failed to save rant");
    }
    const saved: Rant = await res.json();
    const rant = { ...saved, createdAt: new Date(saved.createdAt) };
    setRants((prev) => [rant, ...prev]);
    return rant;
  };

  // Added deleteRant function
  const deleteRant = async (id: string, adminKey: string): Promise<void> => {
    const res = await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminKey }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Failed to delete rant");
    }
    
    // Update state to remove it immediately from the UI
    setRants((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RantContext.Provider value={{ rants, loading, error, addRant, deleteRant }}>
      {children}
    </RantContext.Provider>
  );
}

export function useRants() {
  const ctx = useContext(RantContext);
  if (!ctx) throw new Error("useRants must be used inside RantProvider");
  return ctx;
}