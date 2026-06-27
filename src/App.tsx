import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThoughtsProvider } from "./context/ThoughtsContext";
import { RantProvider } from "./context/RantContext";
import MainScreen from "./components/MainScreen";
import WriteThought from "./components/WriteThought";
import WriteRant from "./components/WriteRant";
import RantPage from "./components/RantPage";
import AdminScreen from "./admin/AdminScreen";
import "./App.css";

function App() {
  return (
    <ThoughtsProvider>
      <RantProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"           element={<MainScreen />} />
            <Route path="/write"      element={<WriteThought />} />
            <Route path="/rant/write" element={<WriteRant />} />
            <Route path="/rant/:id"   element={<RantPage />} />
            <Route path="/admin"      element={<AdminScreen />} />
          </Routes>
        </BrowserRouter>
      </RantProvider>
    </ThoughtsProvider>
  );
}

export default App;