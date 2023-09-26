import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";

export const Login = () => {
  const { form, changed } = useForm({});
  const [submitMessage, setSubmitMessage] = useState(null);
  const { setAuth } = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();
    // obtenemos los datos del formulario
    const userToLogin = form;
    // la petición al backend para comprobar si hay un usuario registrado en la base de datos
    const request = await fetch(`http://localhost:5000/api/login`, {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: { "Content-type": "application/json" },
    });
    const data = await request.json();
    // persistir los datos en el navegador
    console.log(data);
    if (data.success) {
      // persistir los datos
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("User", JSON.stringify(data.User));

      setSubmitMessage(`¡Bienvenido a ColoFullChat ${data.User.name}!`);

      // Redirección después de 2 segundos
      setTimeout(() => {
        setSubmitMessage(null); // Limpia el mensaje de bienvenida
        window.location.reload(); // Recarga la página
      }, 3000);
    } else {
      setSubmitMessage("Algo no funcionó bien, revisa tus datos");
    }
    console.log(data);
  };

  return (
    <>
      <div className="layout-login">
        <div className="container__login">
          <div className="content__post">
            <div>
              {submitMessage && (
                <p className="mensaje-logeado">{submitMessage}</p>
              )}
            </div>
            <form className="login-form" onSubmit={loginUser}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" onChange={changed} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={changed} />
              </div>

              <input
                type="submit"
                value="Identifícate"
                className="btn btn-success"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
