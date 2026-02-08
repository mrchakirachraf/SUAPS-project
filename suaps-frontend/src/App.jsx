import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ActivitiesList from "./pages/ActivitiesList";
import CreateActivity from "./pages/CreateActivity";
import ActivityDetails from "./pages/ActivityDetails";
import ActivityRegister from "./pages/ActivityRegister";
import ActivityPreInscrits from "./pages/ActivityPreInscrits";
import UsersAdmin from "./pages/UsersAdmin";
import SecretariatsAdmin from "./pages/SecretariatsAdmin";
import ActivityEdit from "./pages/ActivityEdit";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/activities" element={<ActivitiesList />} />
        <Route path="/activities/new" element={<CreateActivity />} />
        <Route path="/activities/:id" element={<ActivityDetails />} />
        <Route path="/activities/:id/register" element={<ActivityRegister />} />
        <Route path="/activities/:id/preinscrits" element={<ActivityPreInscrits />} />

        <Route path="/admin/users" element={<UsersAdmin />} />
        <Route path="/admin/secretariat" element={<SecretariatsAdmin />} />
        <Route path="/activities/:id/edit" element={<ActivityEdit />} />






      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
