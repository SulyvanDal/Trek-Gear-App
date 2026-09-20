import { Routes, Route } from "react-router-dom";
import BagsPage from "./pages/BagsPage";
import BagDetailPage from "./pages/BagDetailPage";
import ItemsPage from "./pages/ItemsPage"
function App() {
  return (
    <Routes>
      <Route path="/" element={<BagsPage />} />
      <Route path="/bags/:id" element={<BagDetailPage/>}/>
      <Route path="/items" element={<ItemsPage/>}/>
    </Routes>
  );
}

export default App;
