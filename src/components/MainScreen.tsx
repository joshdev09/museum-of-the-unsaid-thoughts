import { useNavigate } from "react-router-dom";
import { useThoughts } from "../context/ThoughtsContext";
import PolaroidCard from "./PolaroidCard";

function MainScreen() {
  const navigate = useNavigate();
  const { thoughts, loading, error } = useThoughts();

  return (
    <>
      {/* ── Section 1: Polaroid wall ─────────────────────────────────── */}
      <div className="relative min-h-screen pt-5 pb-10">

        {/* Header text */}
        <div className="flex justify-center px-4 text-center">
          <div className="flex flex-col items-center max-w-3xl">
            <h1 className="text-[#333333] patrick-hand-regular text-4xl md:text-6xl p-4">
              Museum of the Unsaid Thoughts
            </h1>
            <p className="text-[#333333] gloria-hallelujah-regular text-base md:text-lg">
              Some people leave our lives carrying answers to questions we never had the courage to ask...
            </p>
          </div>
        </div>

        {/* Write a thought button */}
        <div className="flex justify-center mt-8 md:mt-8 md:block md:absolute md:top-0 md:right-0 md:m-8">
          <button
            onClick={() => navigate("/write")}
            className="p-3 w-40 border-[#333333] transition-colors duration-300 ease-in-out hover:bg-[#333333] hover:text-white border-2 md:border-3 rounded-full patrick-hand-regular flex justify-center items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Write a thought
          </button>
        </div>

        {/* Polaroid canvas — loading / error / empty / filled */}
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-24 gap-3 opacity-50 select-none">
            <div className="w-8 h-8 border-2 border-[#ccc] border-t-[#555] rounded-full animate-spin" />
            <p className="gloria-hallelujah-regular text-[#999] text-sm">Loading the wall...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center mt-24 gap-2 select-none">
            <p className="gloria-hallelujah-regular text-red-400 text-sm text-center max-w-xs">
              Couldn't load the wall. Check your connection and refresh.
            </p>
          </div>
        ) : thoughts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-3 opacity-40 select-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="#888" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="gloria-hallelujah-regular text-[#999] text-sm text-center max-w-xs">
              The wall is empty. Be the first to leave a thought.
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile: horizontal scroll strip ── */}
            <div className="md:hidden mt-10 w-full">
              <div
                className="flex flex-row gap-6 px-6 overflow-x-auto pb-6"
                style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
              >
                {thoughts.map((thought) => (
                  <div
                    key={thought.id}
                    className="flex-shrink-0 transition-transform duration-300 active:scale-105"
                    style={{
                      scrollSnapAlign: "center",
                      transform: `rotate(${thought.rotation}deg)`,
                    }}
                  >
                    <PolaroidCard thought={thought} />
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-[#bbb] patrick-hand-regular mt-1 select-none">
                swipe to explore →
              </p>
            </div>

            {/* ── Desktop: scattered absolute canvas ── */}
            <div
              className="hidden md:block relative mx-auto mt-10"
              style={{ width: "90vw", minHeight: "70vh" }}
            >
              {thoughts.map((thought) => (
                <div
                  key={thought.id}
                  className="absolute transition-transform duration-300 hover:scale-105 hover:z-10"
                  style={{ left: `${thought.x}%`, top: `${thought.y}%` }}
                >
                  <PolaroidCard thought={thought} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Section 2: Black intro panel ────────────────────────────── */}
      <div className="bg-black min-h-screen flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20 p-8 md:p-16 lg:p-24">

        {/* Left Column - Heading */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <h1 className="gloria-hallelujah-regular text-white text-3xl md:text-4xl max-w-sm uppercase leading-relaxed text-center lg:text-left">
            Some thoughts were buried alive the moment you realized they would change nothing.
          </h1>
        </div>

        {/* Right Column - Paragraph */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <p className="nanum-pen-script-regular text-white text-base md:text-lg max-w-lg text-center lg:text-left leading-relaxed">
            Before you enter, understand this:<br /><br />

            Every thought in this place survived a war inside someone's heart. These are the words people rehearsed a thousand times in the shower, on late-night walks, in front of glowing screens, and beside hospital beds. They were carried for years, hidden behind forced smiles, swallowed by pride, fear, timing, or the certainty that nobody would listen.<br /><br />

            Some were meant for lovers who became strangers. Some were meant for parents who never understood. Some were meant for friends who drifted away, and some were meant for people who are no longer alive to hear them. This museum does not preserve artifacts. It preserves absences.<br /><br />

            The apology that arrived too late. The confession that never left trembling lips. The goodbye that was stolen by time. The "I love you" buried beneath silence. The "please stay" that remained trapped in a racing mind. As you walk through these thoughts, remember that every unsaid word leaves a mark. Not because it was spoken, but because it wasn't.<br /><br />

            Welcome to a collection of ghosts.<br /><br />

            Take your time.<br />
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;June 24, 2026
          </p>
        </div>
      </div>

      {/* ── Section 3: Rant Collections ─────────────────────────────── */}
      <div className="min-h-screen relative m-5">
        <div className="flex flex-row items-center">
          <h1 className="text-[#333333] patrick-hand-regular text-2xl md:text-3xl p-4">Rant Collections</h1>
          <button
            onClick={() => navigate("/write")}
            className="p-2 w-25 absolute m-4 right-0 border-[#333333] transition-colors duration-300 ease-in-out hover:bg-[#333333] hover:text-white border-2 md:border-3 rounded-full patrick-hand-regular flex justify-center items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Rant
          </button>
        </div>
      </div>
    </>
  );
}

export default MainScreen;