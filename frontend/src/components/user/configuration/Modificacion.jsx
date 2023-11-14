import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import avatar from "../../../assets/img/user.png";
import { SerializeForm } from "../../../helpers/SerializeForm";
import { Link } from "react-router-dom";
export const Modificacion = () => {
    const { auth, setAuth } = useAuth();
  
    const [saved, setSaved] = useState("not_saved");
    const [isButtonClicked, setIsButtonClicked] = useState(false);
  
    const [imagePreview, setImagePreview] = useState(null); 
    const token = localStorage.getItem("token");
  
    const updateUser = async (e) => {
      e.preventDefault();
      let newDataUser = SerializeForm(e.target);
      delete newDataUser.file0;
  
      const request = await fetch(`http://localhost:5000/api/update`, {
        method: "PUT",
        body: JSON.stringify(newDataUser),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();
  
      setIsButtonClicked(true);
  
      if (data.status === "success") {
        delete data.user.password;
        setAuth(data.user);
        setSaved("Perfil cambiado exitosamente");
  
      // Mostrar el mensaje y recargar la página después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setSaved("Error, no se modificó ningún dato del perfil");
       }
      // Subida de imágenes
      const fileInput = document.querySelector("#file");
      if (data.status === "success" && fileInput.files[0]) {
        // Recoge la imagen y la sube al servidor
        const formData = new FormData();
        formData.append("file0", fileInput.files[0]);
        // Peticion para enviar la imagen al servidor
        const uploadRequest = await fetch(`http://localhost:5000/api/upload`, {
          method: "POST",
          body: formData,
          headers: { Authorization: token },
        });
        const uploadData = await uploadRequest.json();
  
        if (uploadData.status === "success" && uploadData.user) {
          delete uploadData.user.password;
          setAuth(uploadData.user);
          setSaved("Perfil cambiado exitosamente");
        }
      }
    };
  
    // Función para actualizar la vista previa de la imagen
    const handleImagePreview = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    };
    return (
        <>
     <div className="fondo-perfil5">
      <div>
          <header className="content__header">
            <h1 className="content__title">Ajustes</h1>
          </header>
    
          <div className="content__posts1">
            <div className="container-msm">
              {isButtonClicked && (
                <p className={`enviado ${saved.includes("error") ? "error" : ""}`}>
                  {saved.includes("error")
                    ? "Error, no se modificó ningún dato del perfil"
                    : saved}
                </p>
              )}
            </div>
    
            <form onSubmit={updateUser}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" name="name" defaultValue={auth.name} />
              </div>
              <div className="form-group">
                <label htmlFor="surname">Apellidos</label>
                <input type="text" name="surname" defaultValue={auth.surname} />
              </div>
              <div className="form-group">
                <label htmlFor="nick">Nick</label>
                <input type="text" name="nick" defaultValue={auth.nick} />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Biografia</label>
                <textarea name="bio" defaultValue={auth.bio} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electronico</label>
                <input type="email" name="email" defaultValue={auth.email} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password" />
              </div>
              <div className="form-group">
                <label htmlFor="file0">Avatar</label>
                <div className="avatar">
                  {/* Mostrar la vista previa de la imagen */}
                  <div className="general-info__container-avatar">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="container-avatar__img"
                        alt="Vista previa de la imagen"
                      />
                    ) : auth.image && auth.image !== "default.png" ? (
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
                  <br />
                </div>
                <input
                  type="file"
                  name="file0"
                  id="file"
                  onChange={handleImagePreview} // Actualizar vista previa de la imagen
                />
              </div>
              <br />
              <input type="submit" value="actualizar"/>
              <Link className="btn-return" to={"/social/ajustes"}>volver a ajustes</Link>
            </form>
          </div>
          </div>
          </div>
        </>
      );
}
