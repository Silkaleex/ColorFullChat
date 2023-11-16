import { useState } from "react"; 
import { Link } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import axios from "axios";
export const Config = () => {
  const token = localStorage.getItem("token");
  const deleteAccount = async (e) => {
    let opcion = window.confirm("¿Estas Seguro de Eliminar tu Cuenta?");
    if (opcion == true) {
      try {
        const response = await axios.delete("http://localhost:5000/api/user", {
          headers: {
            Authorization: token,
          },
        });
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        console.log(response);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } catch (error) {
        console.log(error.response);
      }
    }
  };
  return (
    <>
      <section className="mod-perfil">
        <h3 className="titulo-perfil">Modificación del Perfil</h3>
        <p className="texto-perfil">
          En esta sección puedes modificar tu nombre, apellidos,correo
          electronico,imagen de avatar, nick{" "}
        </p>
        <Link className="enlace-perfil" to={"/social/mod"}>
          Modificar Perfil
        </Link>
      </section>

      <section className="mod-perfil">
        <h3 className="titulo-perfil">Usuarios Bloqueados</h3>
        <p className="texto-perfil">Usuarios que has bloqueado</p>
        <Link className="enlace-perfil" to={""}>
          Ver usuarios Bloqueados
        </Link>
      </section>

      <section className="mod-perfil">
        <h3 className="titulo-perfil">Privacidad de Cuenta</h3>
        <p className="texto-perfil">
          Puedes ver si tu cuenta es publica o privada
        </p>
        <Link className="enlace-perfil" to={""}>
          Ver estado actual de la cuenta
        </Link>
      </section>

      <section className="elm-usuario">
        <button className="eliminacion" onClick={deleteAccount}>
          Eliminar mi cuenta de usuario
        </button>
      </section>
    </>
  );
};
