import React from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Footer from "./component/Footer/Footer";
import Header from "./component/Account/Header/Header";
import ProfilePage from "./component/Account/ProfilePage/ProfilePage";
import Program from "./component/Account/Program/Program";
import SideNav from "./component/Account/SideNav/SideNav";
import './component/Account/account.css';

const Account = () => {
    const { id } = useParams();
    const userId = localStorage.getItem('userId');

    // Redirect or show error if the ID doesn't match
    if (id !== userId) {
        return <div className="error-message">Unauthorized access</div>;
    }

    return (
        <div className="App1">
            <SideNav />
            <Header />
            <Routes>
                <Route index element={<ProfilePage />} />
                <Route path="program" element={<Program />} />
            </Routes>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
};

export default Account;
