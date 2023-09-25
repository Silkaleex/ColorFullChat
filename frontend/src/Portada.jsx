import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/img/ColorFullChat.png"

export const Portada = () => {
  return (
    <>
    <div className="container-portada">
      <div className="portada">
                <h1 className="titulo">Bienvenidos a ColoFullChat</h1>
        <div className="principal">

            <div className="caja-principal">
                <img src={logo} alt="ColorFullChat"className="logo-portada"/>
                <p className="txt-inicial">La red social para tod@s los colores</p>
            </div>

            </div>
            <p className="txt-secundario">Conoce a gente nueva y chatea a tu gusto sin complicaciones</p>
        </div>
   
            <div className="enlaces">
                <Link to="/registro" className="btn1">Eres Nuevo: Registrate Aqui</Link>
                <Link to="/login" className="btn2">Ya eres usuario: Inicia sesión</Link>
            </div>
            </div>
      
    </>
  );
};
