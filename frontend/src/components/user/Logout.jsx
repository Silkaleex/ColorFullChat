import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const Logout = () => {
  const { setAuth, setCounters } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vaciar el localStorage
    localStorage.clear()
    //Setear estados globales a vacio
    setAuth({})
    setCounters({})
    //Navigate al login
    navigate("/login")
  });
  return (
    <div>
      <h1>Cerrando sesion...</h1>
    </div>
  );
};
