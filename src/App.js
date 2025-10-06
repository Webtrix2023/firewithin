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
import { PodCast } from "./Components/PodCast";
function App() {
  return (<Router>

    {/* Route Definitions */}
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />                 
        <Route path="/signup" element={<Register />} />       // "register" → "signup"
        <Route path="/login" element={<Login />} />
        <Route path="/thank-you" element={<ThankYouPage />} />// "ty" → descriptive
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<UpdatePassword />} />

        {/* App pages */}
        <Route path="/dashboard" element={<HomePage />} />    // "hp" → "dashboard"
        <Route path="/Books/text-advanced" element={<Text />} />     
        <Route path="/Books/text" element={<Text2 />} />
        <Route path="/Books/listen" element={<Player />} />  
        <Route path="/Books/podcasts" element={<PodCast />} />    

      </Routes>

  </Router>)
}

export default App;
