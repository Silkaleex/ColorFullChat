import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llama a la función authUser al cargar el contexto
    authUser();
  }, []);

  const authUser = async () => {
    // sacar datos del usuario identificado del localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("User");

    // comprobar si tengo el token y user
    if (!token || !user) {
      setLoading(false);
      return false;
    }

    // transformar los objetos a JavaScript
    const userObj = JSON.parse(user);
    const id = userObj._id;

    // Peticion ajax al backend que compruebe el token y me devuelva los datos del usuario
    try {
      const request = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: token },
      });
      const data = await request.json();

      setAuth(data.User);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }

    // Peticion de contadores por ajax
    try {
      const requestCounters = await fetch(
        `http://localhost:5000/api/counters/${id}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json", Authorization: token },
        }
      );
      const dataCounters = await requestCounters.json();

      setCounters(dataCounters);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, authUser,setCounters, counters, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// Actualiza el estado de autenticación con los datos del usuario
