import React from "react";
import { Header } from "./Header";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import useAuth from "../../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();
  if (loading == true) {
    return (
      <>
        <div className="container__loads">
          <div className="loadings">
            <h1 className="loads">Cargando</h1>
            <span className="loaders"></span>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* Latyout */}
        {/* Cabecera y Navegación */}
        <Header />
        {/*Contenido Principal */}
        <section className="layout__content">
          {auth._id ? <Outlet /> : <Navigate to="/login" />}
        </section>
        {/* Barra lateral */}
        {/* <Sidebar /> */}
      </>
    );
  }
};
