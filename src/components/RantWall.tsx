import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRants } from "../context/RantContext";
import { RantPreviewCard } from "./WriteRant";

const PAGE_SIZE = 12;

function RantWall() {
  const navigate = useNavigate();
  const { rants, loading } = useRants();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? rants : rants.slice(0, PAGE_SIZE);
  const hasMore = rants.length > PAGE_SIZE;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#ccc] border-t-[#555] rounded-full animate-spin" />
      </div>
    );
  }

  if (rants.length === 0) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center py-16 gap-3 opacity-40 select-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="#888" className="size-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        <p className="gloria-hallelujah-regular text-[#999] text-sm text-center max-w-xs">
          No rants yet. Be the first to let it out.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((rant) => (
          <RantPreviewCard
            key={rant.id}
            title={rant.title}
            text={rant.text}
            font={rant.font}
            palette={rant.palette}
            createdAt={new Date(rant.createdAt)}
            compact
            onRead={() => navigate(`/rant/${rant.id}`)}
          />
        ))}
      </div>

      {/* Show more / collapse */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="px-6 py-2.5 rounded-full border border-[#ccc] text-[#777] hover:border-[#888] hover:text-[#333] patrick-hand-regular text-sm transition-all cursor-pointer"
            style={{ touchAction: "manipulation" }}
          >
            {showAll ? "Show less" : `Show ${rants.length - PAGE_SIZE} more rants`}
          </button>
        </div>
      )}
    </div>
  );
}

export default RantWall;
