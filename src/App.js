import Register from "./Components/Register";
import Home from "./Pages/Home"
import Login from "./Components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThankYouPage from "./Components/ThankYouPage";
import ForgotPassword from "./Components/ForgotPassword";
import HomePage from "./Components/HomePage";
import Player from "./Components/Player";
import { Text } from "./Components/Text";
import { Text2 } from "./Components/Text2"
import { UpdatePassword } from "./Components/UpdatePassword";
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
      <Route path="/text2" element={<Text2 />} />
      <Route path="/music" element={<Player />} />
      <Route path="/update-password" element={<UpdatePassword />} />
    </Routes>
  </Router>)
}

export default App;
