import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TopMovies from "./pages/topMovies";
import Trindingmoves from "./pages/trindingmoves";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Trindingmoves />} />
        <Route path="/SearchSongs" element={<TopMovies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
