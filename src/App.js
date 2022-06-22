
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react";
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dropdown from "./components/Dropdown";
import ScrollToTop from "./components/ScrollToTop";
import PrivateRoute from "./components/PrivateRoute"

import Home from "./pages/Home";
import HouseDetails from "./pages/HouseDetails";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateAd from "./pages/CreateAd"
import EditAd from "./pages/EditAd"
import Type from "./pages/Type";
import For from "./pages/For"

function App() {

  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <Router>
        <ScrollToTop />
        <div className="container">
          <Navbar isOpen={isOpen} toggle={toggle} />
          <Dropdown isOpen={isOpen} toggle={toggle} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/house/:houseId" element={<HouseDetails />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/create-ad" element={<CreateAd />} />
            <Route path="/edit/:houseId" element={<EditAd />} />
            <Route path="/type/:typeName" element={<Type />} />
            <Route path="/for-:forType" element={<For />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
