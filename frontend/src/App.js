import { AuthProvider } from "./lib/auth.context";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./index.css";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Emotions from "./pages/Emotions";
import Auth from "./pages/Auth";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/emotions" element={<Emotions />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
