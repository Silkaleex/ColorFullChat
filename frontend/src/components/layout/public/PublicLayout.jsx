import React from "react";
import { Header } from "./Header";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export const PublicLayout = () => {
  const { auth } = useAuth();
  return (
    <>
      {/* Latouy */}
      <Header />

      {/*Contenido Principal */}
      <section className="layout__content">
        {!auth._id ? <Outlet /> : <Navigate to="/social" />} 
        {/*Aqui restringimos el acceso a login o register a un usuario que ya esta logeado*/}
      </section>
    </>
  );
};
