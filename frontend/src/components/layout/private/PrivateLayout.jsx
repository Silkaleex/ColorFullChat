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
        <div className="container__load">
          <div>
            <div>          
                <h1 className="load">Cargando<span className="loader"></span></h1>       
            </div>
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
