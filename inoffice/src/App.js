import "./App.css";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import Login from "./components/LoginForm/Login";

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
