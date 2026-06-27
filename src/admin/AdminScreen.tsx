import { useState } from "react";
import { useThoughts } from "../context/ThoughtsContext";
import { useRants } from "../context/RantContext"; // Added Rant context
import { type Thought } from "../types/thought";
import { type Rant } from "../types/rant"; // Ensure you import your Rant type

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: (key: string) => void }) {
  const [input, setInput] = useState("");
  const [wrong, setWrong] = useState(false);

  const attempt = () => {
    if (!input.trim()) return;
    if (input.trim().length < 4) { setWrong(true); return; }
    onUnlock(input.trim());
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="patrick-hand-regular text-[#333] text-3xl text-center">Admin Access</h1>
        <p className="gloria-hallelujah-regular text-[#999] text-xs text-center">
          This page is not for visitors.
        </p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setWrong(false); }}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          placeholder="Enter admin key..."
          className={`border rounded-lg px-4 py-3 patrick-hand-regular text-[#333] text-base focus:outline-none bg-white ${
            wrong ? "border-red-400" : "border-[#ccc] focus:border-[#555]"
          }`}
        />
        {wrong && (
          <p className="text-red-400 text-xs patrick-hand-regular text-center">
            Key too short. Try again.
          </p>
        )}
        <button
          onClick={attempt}
          className="py-3 rounded-full bg-[#333] text-white patrick-hand-regular text-base hover:bg-[#555] transition-colors cursor-pointer"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}

// ── Polaroid row ──────────────────────────────────────────────────────────────
function AdminPolaroidRow({ thought, adminKey, onDeleted }: { thought: Thought; adminKey: string; onDeleted: () => void; }) {
  const { deleteThought } = useThoughts();
  const [confirming, setConfirming] = useState(false);
  const [deleting,   setDeleting  ] = useState(false);
  const [error,      setError     ] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteThought(thought.id, adminKey);
      onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#e8e0d0] shadow-sm">
      <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded bg-gray-100">
        <img src={thought.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="gloria-hallelujah-regular text-[#333] text-sm leading-snug line-clamp-2">{thought.text}</p>
        <p className="patrick-hand-regular text-[#bbb] text-xs mt-1">
          {new Date(thought.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        {error && <p className="text-red-400 text-xs mt-1 patrick-hand-regular">{error}</p>}
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="px-3 py-1.5 rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 patrick-hand-regular text-sm transition-all cursor-pointer">Delete</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setConfirming(false)} disabled={deleting} className="px-3 py-1.5 rounded-full border border-[#ccc] text-[#888] patrick-hand-regular text-sm transition-all cursor-pointer">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="px-3 py-1.5 rounded-full bg-red-500 text-white patrick-hand-regular text-sm hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50">{deleting ? "Deleting..." : "Confirm"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Rant row ──────────────────────────────────────────────────────────────────
function AdminRantRow({ rant, adminKey, onDeleted }: { rant: Rant; adminKey: string; onDeleted: () => void; }) {
  const { deleteRant } = useRants();
  const [confirming, setConfirming] = useState(false);
  const [deleting,   setDeleting  ] = useState(false);
  const [error,      setError     ] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteRant(rant.id, adminKey);
      onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#e8e0d0] shadow-sm">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[#333] text-md line-clamp-1 truncate">{rant.title || "Untitled"}</h3>
        <p className="patrick-hand-regular text-[#555] text-sm leading-snug line-clamp-2 mt-1">{rant.text}</p>
        <p className="patrick-hand-regular text-[#bbb] text-xs mt-1">
          {new Date(rant.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        {error && <p className="text-red-400 text-xs mt-1 patrick-hand-regular">{error}</p>}
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="px-3 py-1.5 rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 patrick-hand-regular text-sm transition-all cursor-pointer">Delete</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setConfirming(false)} disabled={deleting} className="px-3 py-1.5 rounded-full border border-[#ccc] text-[#888] patrick-hand-regular text-sm transition-all cursor-pointer">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="px-3 py-1.5 rounded-full bg-red-500 text-white patrick-hand-regular text-sm hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50">{deleting ? "Deleting..." : "Confirm"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Admin screen ──────────────────────────────────────────────────────────────
function AdminScreen() {
  const { thoughts, loading: thoughtsLoading } = useThoughts();
  const { rants, loading: rantsLoading } = useRants();
  
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [filter,   setFilter  ] = useState("");
  const [activeTab, setActiveTab] = useState<"thoughts" | "rants">("thoughts");

  if (!adminKey) {
    return <PasswordGate onUnlock={(key) => setAdminKey(key)} />;
  }

  // Filter based on active tab
  const filteredThoughts = thoughts.filter(
    (t) => t.text.toLowerCase().includes(filter.toLowerCase()) || new Date(t.createdAt).toLocaleDateString().includes(filter)
  );
  
  const filteredRants = rants.filter(
    (r) => (r.title && r.title.toLowerCase().includes(filter.toLowerCase())) || 
           r.text.toLowerCase().includes(filter.toLowerCase()) || 
           new Date(r.createdAt).toLocaleDateString().includes(filter)
  );

  const isLoading = activeTab === "thoughts" ? thoughtsLoading : rantsLoading;
  const currentItemsLength = activeTab === "thoughts" ? filteredThoughts.length : filteredRants.length;
  const totalItemsLength = activeTab === "thoughts" ? thoughts.length : rants.length;

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-16">
      {/* Header */}
      <header className="sticky top-0 bg-[#faf8f5] border-b border-[#e0d8cc] px-6 py-4 z-10 flex flex-col gap-4">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between gap-4">
          <h1 className="patrick-hand-regular text-[#333] text-2xl flex-shrink-0">
            Admin Panel
          </h1>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={`Filter ${activeTab}...`}
            className="flex-1 border border-[#ccc] rounded-full px-4 py-2 patrick-hand-regular text-sm text-[#333] focus:outline-none focus:border-[#555] bg-white"
          />
          <span className="patrick-hand-regular text-[#aaa] text-sm flex-shrink-0">
            {currentItemsLength} / {totalItemsLength}
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="max-w-2xl mx-auto w-full flex gap-2">
          <button 
            onClick={() => setActiveTab("thoughts")}
            className={`flex-1 py-2 rounded-full patrick-hand-regular text-sm transition-colors ${activeTab === "thoughts" ? "bg-[#333] text-white" : "bg-[#e8e0d0] text-[#555] hover:bg-[#dcd3c1]"}`}
          >
            Polaroid Thoughts
          </button>
          <button 
            onClick={() => setActiveTab("rants")}
            className={`flex-1 py-2 rounded-full patrick-hand-regular text-sm transition-colors ${activeTab === "rants" ? "bg-[#333] text-white" : "bg-[#e8e0d0] text-[#555] hover:bg-[#dcd3c1]"}`}
          >
            Rant Wall
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 pt-6 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <div className="w-8 h-8 border-2 border-[#ccc] border-t-[#555] rounded-full animate-spin" />
          </div>
        ) : currentItemsLength === 0 ? (
          <p className="text-center gloria-hallelujah-regular text-[#bbb] text-sm mt-20">
            No {activeTab} found.
          </p>
        ) : (
          activeTab === "thoughts" ? (
            filteredThoughts.map((thought) => (
              <AdminPolaroidRow key={thought.id} thought={thought} adminKey={adminKey} onDeleted={() => {}} />
            ))
          ) : (
            filteredRants.map((rant) => (
              <AdminRantRow key={rant.id} rant={rant} adminKey={adminKey} onDeleted={() => {}} />
            ))
          )
        )}
      </main>
    </div>
  );
}

export default AdminScreen;