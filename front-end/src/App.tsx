import { Routes, Route } from "react-router-dom";
import BagsPage from "./pages/BagsPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<BagsPage />} />
    </Routes>
  );
}

export default App;
