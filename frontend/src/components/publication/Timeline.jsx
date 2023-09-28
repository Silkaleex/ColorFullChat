import React, { useState, useEffect } from "react";
import { CardBody, CardTitle, CardText, Card } from "reactstrap";
import { useForm } from "../../hooks/useForm";

export const Timeline = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const { form, changed } = useForm({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Realiza una solicitud GET al backend para obtener todas las publicaciones con texto e imagen
    fetch("http://localhost:5000/api/details", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          setPublicaciones(data.publicaciones);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error al obtener las publicaciones:", error);
      });
  }, []);

  const handlePublication = async (e) => {
    e.preventDefault();

    // Recoger los datos del formulario
    const formData = new FormData();
    formData.append("text", form.text);
    const fileInput = document.querySelector("#file");

    if (fileInput.files[0]) {
      formData.append("file0", fileInput.files[0]);
    }

    const request = await fetch(`http://localhost:5000/api/save`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: token,
      },
    });

    const data = await request.json();
    console.log(data);

    if (data.success === true) {
      setPublicaciones([...publicaciones, data.nuevaPublicacion]);
      form.text = "";
      document.querySelector("#file").value = null;
    } else {
      console.error("Error al guardar la publicación");
    }
  };

  return (
    <div className="fondo-perfil">
      <div className="container-img">
        <div className="caja-input-img">
          <form
            className="container-form__form-post"
            onSubmit={handlePublication}
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
                className="form-post__image"
              />
            </div>

            <input
              type="submit"
              value="Enviar"
              className="form-post__btn-submit"
            />
          </form>
        </div>
        <div className="publicaciones-img">
          {publicaciones.map((publicacion) => (
            <Card key={publicacion._id} className="cuadro-img">
              <CardBody>
                <CardTitle tag="h3" className="titulo-img">
                  Card title
                </CardTitle>
                {publicacion.file && (
                  <img
                    src={`http://localhost:5000/${publicacion.file}`} 
                    alt="Publicación"
                    className="imagen-publicacion"
                  />
                )}
                <CardText className="texto-img">{publicacion.text}</CardText>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
