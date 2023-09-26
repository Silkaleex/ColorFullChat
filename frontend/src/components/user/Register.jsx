import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";

export const Register = () => {
  const { form, changed } = useForm({});
  const [submitMessage, setSubmitMessage] = useState(null);

  const saveUser = async (e) => {
    // Prevenimos la actualización de la pantalla
    e.preventDefault();

    // recoger los datos del formulario
    let newUser = form;

    // guardar datos en el backend
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
    console.log(data);
  };

  return (
    <>
      <div className="layout-register">
        <div className="container__formulario ">
          <header className="content__header">
            <h1 className="content__title">
              Estas a un paso de ser uno mas,¿A que esperas?, Registrate{" "}
            </h1>
          </header>
          <div className="content__posts">
            <div>
              {<p className="mensaje-erroneo">{submitMessage}</p> && (
                <p className="mensaje-enviado">{submitMessage}</p>
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
          </div>
        </div>
      </div>
    </>
  );
};
