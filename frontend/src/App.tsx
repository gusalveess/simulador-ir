import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Navbar from "./components/NavBar";
import Register from "./pages/auth/Register";
import Dashboard from './pages/declarations/Dashboard'
import DeclarationDetails from "./pages/declarations/DeclarationDetails";
import NotFoundPage from "./pages/servicepages/NotFound";
import ErrorPage from "./pages/servicepages/ErrorPage";
import CreateDeclaration from "./pages/declarations/CreateDeclaration";
import UserSettings from "./pages/user/UserSettings";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/declaration/:id" element={<DeclarationDetails />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/create-declaration/:id" element={<CreateDeclaration />} />
          <Route path="/user-settings" element={<UserSettings />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;