import React from "react";
import { Link } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
export const Config = () => {
  return (
    <>
      <section className="filtrado">
        <h2 className="txt-filtrado">Buscar:</h2>
        <input
          type="search"
          name="buscar"
          className="buscar-filtrado"
          minLength={10}
          maxLength={40}
        />
        <FaMagnifyingGlass className="icn-filtrado" />
      </section>

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
        <Link className="eliminacion" to={""}>
          Eliminar mi cuenta de usuario
        </Link>
      </section>
    </>
  );
};
