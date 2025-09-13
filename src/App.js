import Register from "./Components/Register";
import Home from "./Pages/Home"
import Login from "./Components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThankYouPage from "./Components/ThankYouPage";
import ForgotPassword from "./Components/ForgotPassword";
import HomePage from "./Components/HomePage";
import Player from "./Components/Player";
import { Text } from "./Components/Text";
function App() {
  return (<Router>

    {/* Route Definitions */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ty" element={<ThankYouPage />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
      <Route path="/hp" element={<HomePage />} />
      <Route path="/text" element={<Text />} />
      <Route path="/music" element={<Player />} />
    </Routes>
  </Router>)
}

export default App;
