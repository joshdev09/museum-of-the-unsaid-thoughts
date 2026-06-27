import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThoughtsProvider } from "./context/ThoughtsContext";
import MainScreen from "./components/MainScreen";
import WriteThought from "./components/WriteThought";
import AdminScreen from "./admin/AdminScreen";
import "./App.css";

function App() {
  return (
    <ThoughtsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"       element={<MainScreen />} />
          <Route path="/write"  element={<WriteThought />} />
          
          {/* Hidden admin route */}
          <Route path="/admin"  element={<AdminScreen />} />
        </Routes>
      </BrowserRouter>
    </ThoughtsProvider>
  );
}

export default App;