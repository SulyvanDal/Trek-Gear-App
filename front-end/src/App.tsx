import { Routes, Route } from "react-router-dom";
import BagsPage from "./pages/BagsPage";
import BagDetailPage from "./pages/BagDetailPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<BagsPage />} />
      <Route path="/bags/:id" element={<BagDetailPage/>}/>
    </Routes>
  );
}

export default App;
