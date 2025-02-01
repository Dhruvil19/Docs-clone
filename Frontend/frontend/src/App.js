import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Documents from "./pages/Documents";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </Router>
  );
}

export default App;
