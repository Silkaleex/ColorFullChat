import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Link } from "react-router-dom";

export const Register = () => {
  const { form, changed } = useForm({});
  const [submitMessage, setSubmitMessage] = useState(null);

  const saveUser = async (e) => {
    e.preventDefault();

    let newUser = form;

    const request = await fetch(`http://localhost:5000/api/register`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: { "Content-type": "application/json" },
    });

    const data = await request.json();
    if (data.success) {
      setSubmitMessage("Formulario enviado exitosamente");
    } else {
      setSubmitMessage("Error al enviar el formulario");
    }

    // Redirige al usuario a la página de inicio después de 2 segundos
    setTimeout(() => {
      window.location.href = "/login"; 
    }, 2000);
  };

  return (
    <>
      <div className="layout-register">
        <div className="container__formulario ">
          <header className="content__header">
            <h1 className="content__title">
              Estás a un paso de ser uno más, ¿A qué esperas? Regístrate
            </h1>
          </header>
          <div className="content__posts">
            <div>
              {submitMessage && (
                <p
                  className={`mensaje-logeado ${
                    submitMessage === "Error al enviar el formulario"
                      ? "mensaje-error"
                      : "mensaje-enviado"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </div>

            <form className="register-form" onSubmit={saveUser}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" name="name" onChange={changed} />
              </div>
              <div className="form-group">
                <label htmlFor="surname">Apellidos</label>
                <input type="text" name="surname" onChange={changed} />
              </div>
              <div className="form-group">
                <label htmlFor="nick">Nick</label>
                <input type="text" name="nick" onChange={changed} />
              </div>
              <div className="form-group">
                <label htmlFor="bio">bio</label>
                <input type="text" name="bio" onChange={changed} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electronico</label>
                <input type="email" name="email" onChange={changed} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password" onChange={changed} />
              </div>

              <input
                type="submit"
                value="Registrate"
                className="btn btn-success"
              />
            </form>
            <div className="btn-botones">
              <h6 className="titulo-btn">Volver a Inicio</h6>
              <Link className="btn-portada" to="/">
                Inicio
              </Link>
              <h6 className="titulo-btn">¿Tienes cuenta ya?</h6>
              <Link className="btn-login" to="/login">
                inica sesion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
