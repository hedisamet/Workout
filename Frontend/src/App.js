import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./component/Footer/Footer";
import Hero from "./component/Hero";
import Join from "./component/Join/Join";
import Plans from "./component/Plans/Plans";
import Programms from "./component/Programms/Programms";
import Reasons from "./component/Reasons/Reasons";
import Testimonials from "./component/Testimonials/Testimonials";
import Account from "./account";
import MealsPage from "./meals";
import Login from "./component/login/login";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            <Hero />
            <section id="Programms">
              <Programms />
            </section>
            <Plans />
            <section id="Reasons">
              <Reasons />
              <Testimonials />
            </section>
            <section id="JoinUs">
              <Join />
            </section>
            <Footer />
          </div>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/account/:id/*" element={<Account />} />
      <Route path="/meals/:id" element={<MealsPage />} />
    </Routes>
  );
}

export default App;
