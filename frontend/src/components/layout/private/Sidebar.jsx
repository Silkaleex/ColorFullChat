import React, { useState, useEffect, useRef } from "react";
import avatar from "../../../assets/img/user.png";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "../../../hooks/useForm";

export const Sidebar = () => {
  const [user, setUser] = useState([]);
  const { auth, counters } = useAuth({});
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [publicationsCount, setPublicationsCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user._id) {
      axios
        .get(`http://localhost:5000/api/details`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log(response);
          setPublicationsCount(response.data.publicaciones);
        })
        .catch((error) => {
          console.error("Error al obtener los contadores:", error);
        });
    }
  }, [user._id]);

  const formRef = useRef(null);

  const savePublication = async (e) => {
    e.preventDefault();

    // Recoger los datos del formulario
    const formData = new FormData();

    // Agrega el contenido de la publicación
    formData.append("text", form.text); // Donde "form.text" es el contenido de la publicación

    // Agrega el archivo de imagen seleccionado
    const fileInput = document.querySelector("#file");
    if (fileInput.files[0]) {
      formData.append("file0", fileInput.files[0]); // Donde "file0" es el nombre del campo de archivo en el formulario
    }

    // Hacer request para guardar en la base de datos
    const request = await fetch(`http://localhost:5000/api/save`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: token,
      },
    });

    const data = await request.json();
    console.log(data);
    setIsButtonClicked(true);

    if (data.success === true) {
      setStored("stored");

      if (data.status === "success" && fileInput.files[0]) {
        const uploadFormData = new FormData();
        uploadFormData.append("file0", fileInput.files[0]);

        const uploadRequest = await fetch(
          `http://localhost:5000/api/upload/${data.nuevaPublicacion._id}`,
          {
            method: "POST",
            body: uploadFormData,
            headers: { Authorization: token },
          }
        );

        const uploadData = await uploadRequest.json();
        if (uploadData.status === "success") {
          setStored("stored");
        } else {
          setStored("error");
        }
        console.log(uploadRequest);
      }

      if (formRef.current) {
        formRef.current.reset();
      }

      // Set a timeout to refresh the page after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setStored("error");
    }
  };

  return (
    <>
      <div className="layout-sidebar">
        <aside className="layout__aside">
          <header className="aside__header">
            <h1 className="aside__title">Hola, {auth.name}</h1>
          </header>

          <div className="aside__container">
            <div className="aside__profile-info">
              <div className="profile-info__general-info">
                <div className="general-info__container-avatar">
                  {auth.image && auth.image !== "default.png" ? (
                    <img
                      src={`http://localhost:5000/api/upload/${auth.image}`}
                      className="container-avatar__img"
                      alt="Foto de perfil"
                    />
                  ) : (
                    <img
                      src={avatar}
                      className="container-avatar__img"
                      alt="Foto de perfil"
                    />
                  )}
                </div>

                <div className="general-info__container-names">
                  <Link
                    to={`/social/perfil/${auth._id}`}
                    className="container-names__name"
                  >
                    {auth.name} {auth.surname}
                  </Link>
                  <p className="container-names__nickname">{auth.nick}</p>
                </div>
              </div>

              <div className="profile-info__stats">
                <div className="stats__following">
                  <Link to={`/social/siguiendo/${auth._id}`} className="following__link">
                    <span className="following__title">Siguiendo</span>
                    <span className="following__number">
                      {counters.following}
                    </span>
                  </Link>
                </div>
                <div className="stats__following">
                  <Link
                    to={`/social/seguidores/${auth._id}`}
                    className="following__link"
                  >
                    <span className="following__title">Seguidores</span>
                    <span className="following__number">{counters.followed}</span>
                  </Link>
                </div>
                <div className="stats__following">
                  <span href="#" className="following__link">
                    <span className="following__title">Publicaciones</span>
                    <span className="following__number">
                      {counters.publications}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="aside__container-form">
              {isButtonClicked && (
                <p
                  className={`enviado-msm ${
                    stored.includes("error") ? "error-msm" : ""
                  }`}
                >
                  {stored.includes("error")
                    ? "Error, no se añadió la publicación"
                    : "Publicación agregada exitosamente"}
                </p>
              )}
              <form
                ref={formRef}
                className="container-form__form-post"
                onSubmit={savePublication}
                encType="multipart/form-data"
              >
                <div className="form-post__inputs">
                  <label htmlFor="text" className="form-post__label">
                    ¿Qué estás pensando hoy?
                  </label>
                  <textarea
                    name="text"
                    className="form-post__textarea"
                    onChange={changed}
                    placeholder="Escribe aquí tu texto"
                  />
                </div>

                <div className="form-post__inputs">
                  <label htmlFor="file" className="form-post__label">
                    Sube tu foto
                  </label>
                  <input
                    type="file"
                    name="file0"
                    id="file"
                    className="form-post__image "
                  />
                </div>

                <input
                  type="submit"
                  value="Enviar"
                  className="form-post__btn-submit load-more-button2"
                />
              </form>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
