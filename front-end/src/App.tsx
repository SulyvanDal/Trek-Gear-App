import { Routes, Route } from "react-router-dom";
import BagsPage from "./pages/BagsPage";
import BagDetailPage from "./pages/BagDetailPage";
import ItemsPage from "./pages/ItemsPage"
import { NavBar } from "./components/NavBar";
function App() {
  return (
    <>
    <NavBar></NavBar>
    <Routes>
      <Route path="/bags" element={<BagsPage />} />
      <Route path="/bags/:id" element={<BagDetailPage/>}/>
      <Route path="/items" element={<ItemsPage/>}/>
    </Routes>
    </>
  );
}

export default App;
