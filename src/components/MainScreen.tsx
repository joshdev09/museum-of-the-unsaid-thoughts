import { useNavigate } from "react-router-dom";
import { useThoughts } from "../context/ThoughtsContext";
import PolaroidCard from "./PolaroidCard";
import "../App.css";

//profile
import profile from '../assets/profile.jpg'

function MainScreen() {
  const navigate = useNavigate();
  const { thoughts, loading, error } = useThoughts();

  return (
    <div className="w-full overflow-x-hidden">

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
            {/* ── Mobile: hanging string + horizontal scroll ── */}
            <div className="md:hidden mt-6 w-full">

              {/* String SVG — stretches full width */}
              <div className="w-full px-2 select-none pointer-events-none" aria-hidden>
                <svg
                  width="100%"
                  height="28"
                  viewBox="0 0 400 28"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* The sagging string */}
                  <path
                    d="M 0 4 Q 100 22 200 6 Q 300 -8 400 4"
                    fill="none"
                    stroke="#b0a090"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  {/* Knot dots evenly spaced */}
                  {[40, 120, 200, 280, 360].map((cx) => (
                    <circle key={cx} cx={cx} cy={cx === 200 ? 7 : cx < 200 ? 15 : 10} r="2.2" fill="#b0a090" />
                  ))}
                </svg>
              </div>

              {/* Scrollable strip — hidden scrollbar, padding so tilted cards don't clip */}
              <div
                className="hide-scrollbar flex flex-row gap-8 px-8 overflow-x-auto"
                style={{
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                  paddingTop: "16px",
                  paddingBottom: "32px",
                  /* hide scrollbar cross-browser */
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {thoughts.map((thought, i) => {
                  // Alternate clips — odd cards hang lower to follow string sag
                  const hangOffset = i % 2 === 0 ? 0 : 12;
                  return (
                    <div
                      key={thought.id}
                      className="flex-shrink-0 flex flex-col items-center"
                      style={{ scrollSnapAlign: "center", marginTop: hangOffset }}
                    >
                      {/* Tiny clip pin */}
                      <div
                        className="w-3 h-3 rounded-full border border-[#aaa] bg-white shadow-sm mb-[-4px] z-10 relative"
                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                      />
                      {/* Short string from clip to polaroid */}
                      <div className="w-px h-4 bg-[#c0b0a0]" />
                      {/* Polaroid with tilt — wrapped so clip always stays at top */}
                      <div
                        className="transition-transform duration-300 active:scale-105"
                        style={{ transform: `rotate(${thought.rotation}deg)` }}
                      >
                        <PolaroidCard thought={thought} />
                      </div>
                    </div>
                  );
                })}
                {/* Trailing spacer so last card isn't flush against edge */}
                <div className="flex-shrink-0 w-4" />
              </div>

              {/* Swipe hint */}
              <p className="text-center text-xs text-[#bbb] patrick-hand-regular select-none -mt-4">
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
            //onClick={() => navigate("/write")}
            className="p-2 w-25 absolute m-4 right-0 border-[#333333] transition-colors duration-300 ease-in-out hover:bg-[#333333] hover:text-white border-2 md:border-3 rounded-full patrick-hand-regular flex justify-center items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Rant
          </button>
        </div>

        <div className="flex flex-col min-h-screen justify-center items-center patrick-hand-regular text-[#333333]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-[#333333]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
          <h1>Work in progress</h1>
          <p>I'm a lazy developer give me some time</p>
        </div>
      </div>

      {/*Footer*/}
      <footer className="bg-[#c6bbae] text-[#333333] py-8 px-6 font-sans border-t border-[#b5a99c]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        
        {/* Left Side: Mental Health Hotlines */}
        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="text-xl font-bold text-[#333333] mb-4">Mental Health Hotlines (PH)</h2>
          
          <div className="space-y-4 text-sm text-gray-700">
            {/* NCMH */}
            <div>
              <h3 className="font-semibold text-[#333333]">National Center for Mental Health (24/7)</h3>
              <p>1553 (Luzon landlines) / 1800-1888-1553 (Toll-free)</p>
              <p>0917-899-8727 / 0966-351-4518 (Globe/TM)</p>
              <p>0919-057-1553 (Smart/TNT)</p>
            </div>

            {/* HOPELINE */}
            <div>
              <h3 className="font-semibold text-[#333333]">HOPELINE PH (24/7)</h3>
              <p>2919 (Toll-free Globe/TM) / (02) 804-4673</p>
              <p>0917-558-4673 (Globe/TM) / 0918-873-4673 (Smart/TNT)</p>
            </div>

            {/* In Touch */}
            <div>
              <h3 className="font-semibold text-[#333333]">In Touch Community Services (24/7)</h3>
              <p>(02) 8893-7603 / 0917-800-1123</p>
              <p>0922-893-8944 / 0919-056-0709</p>
            </div>

            {/* Tawag Paglaum */}
            <div>
              <h3 className="font-semibold text-[#333333]">Tawag Paglaum (Visayas-based)</h3>
              <p>0939-937-5433 / 0939-936-5433 / 0927-654-1629</p>
            </div>
          </div>
        </div>

        {/* Center: Developer Details */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-300 border-2 border-white shadow-sm overflow-hidden mb-2 flex items-center justify-center">
            {/* Replace this img src with your actual profile picture URL */}
            <img 
              src={ profile } 
              alt="Shua Halili" 
              className="w-full h-full object-cover" 
            />
          </div>
          <p className="text-sm font-semibold text-[#333333]">Developed by Shua Halili</p>
        </div>

        {/* Right Side: Social Media Icons */}
        <div className="flex-1 w-full flex justify-center md:justify-end gap-5">
          {/* Facebook */}
          <a href="https://www.facebook.com/joshua.emmanuel.m.halili" target="_blank" rel="noopener noreferrer" className="text-[#333333] hover:text-blue-600 transition-colors" aria-label="Facebook">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          
          {/* Instagram */}
          <a href="https://www.instagram.com/shu_wawaa?igsh=MTdpNm1sMW53dmkyYg==" target="_blank" rel="noopener noreferrer" className="text-[#333333] hover:text-pink-600 transition-colors" aria-label="Instagram">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
            </svg>
          </a>

          {/* GitHub */}
          <a href="https://github.com/joshdev09" target="_blank" rel="noopener noreferrer" className="text-[#333333] hover:text-gray-900 hover:scale-110 transition-all" aria-label="GitHub">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/in/joshua-emmanuel-m-halili-133155377/" target="_blank" rel="noopener noreferrer" className="text-[#333333] hover:text-blue-700 transition-colors" aria-label="LinkedIn">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>

      </div>
    </footer>

    </div>
  );
}

export default MainScreen;