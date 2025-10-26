import React from "react";
import "leaflet/dist/leaflet.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./index.css";


import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
//import CompanyDash from "./dashboard/CompanyDash";
import EmissionTracker from "./dashboard/GoveDash";
import EmissionDashboard from "./utils/SetEmission";
import PendingRegistrations from "./utils/VerifyCompany";
import QueryManagement from "./utils/Queries_Gov";




const App = () => {
  return (
   <div>
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<CompanyDash />} /> */}
      <Route path="/government" element={<EmissionTracker />} />
      <Route path="/set-emission-limits" element={<EmissionDashboard />} />
      <Route path="/verification-requests" element={<PendingRegistrations />} />
      <Route path="/answering-query" element={<QueryManagement />} />
    </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
