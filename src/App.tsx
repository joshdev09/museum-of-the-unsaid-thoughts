import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThoughtsProvider } from "./context/ThoughtsContext";
import MainScreen from "./components/MainScreen";
import WriteThought from "./components/WriteThought";
import "./App.css";

function App() {
  return (
    <ThoughtsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/write" element={<WriteThought />} />
        </Routes>
      </BrowserRouter>
    </ThoughtsProvider>
  );
}

export default App;