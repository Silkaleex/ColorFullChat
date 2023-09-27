import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/img/ColorFullChat.png";

export const Portada = () => {
  return (
    <>
      <div className="layout-register">
        <div className="container-portada">
          <div className="fondo-portada">
          <div className="portada">
            <h1 className="titulo animate__animated animate__bounceIn">
              <span className="rojo">B</span>
              <span className="naranja">i</span>
              <span className="amarillo">e</span>
              <span className="verde">n</span>
              <span className="azul">v</span>
              <span className="violeta">e</span>
              <span className="rojo">n</span>
              <span className="naranja">i</span>
              <span className="amarillo">d</span>
              <span className="verde">o</span>
              <span className="azul">s</span>
              <span className="violeta"> </span>
              <span className="violeta"> </span>
              <span className="violeta"> </span>
              <span className="violeta"> </span>
              <span className="rojo">a</span>
              <span className="naranja"> </span>
              <br />
              <span className="amarillo">C</span>
              <span className="verde">o</span>
              <span className="azul">l</span>
              <span className="violeta">o</span>
              <span className="rojo">r</span>
              <span className="naranja">F</span>
              <span className="amarillo">u</span>
              <span className="verde">l</span>
              <span className="azul">l</span>
              <span className="violeta">C</span>
              <span className="rojo">h</span>
              <span className="naranja">a</span>
              <span className="amarillo">t</span>
            </h1>

            <div className="principal">
              <div className="caja-principal">
                <img src={logo} alt="ColorFullChat" className="logo-portada" />
                <p className="txt-inicial">
                El apoyo es nuestra mayor fortaleza.
                </p>
              </div>
            </div>
            <p className="txt-secundario">
            Nuestra comunidad es nuestra familia. Unete y disfruta se uno mas!
            </p>
          </div>

          <div className="enlaces">
            <Link to="/registro" className="btn1">
              Eres Nuevo: Registrate Aqui
            </Link>
            <Link to="/login" className="btn2">
              Ya eres usuario: Inicia sesión
            </Link>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};
