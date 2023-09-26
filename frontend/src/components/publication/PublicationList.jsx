import React from "react";
import avatar from "../../assets/img/user.png";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
function formatDate(dateString) {
  const currentDate = new Date();
  const publicationDate = new Date(dateString);

  const timeDifference = currentDate - publicationDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `Publicado hace ${months} ${months === 1 ? "mes" : "meses"}`;
  } else if (days > 0) {
    return `Publicado hace ${days} ${days === 1 ? "día" : "días"}`;
  } else if (hours > 0) {
    return `Publicado hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  } else if (minutes > 0) {
    return `Publicado hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  } else {
    return `Publicado hace ${seconds} ${seconds === 1 ? "segundo" : "segundos"}`;
  }
}

export const PublicationList = ({
  publications,
  setPublications,
  page,
  setPage,
  loading,
}) => {
  const { auth } = useAuth();
  const token = localStorage.getItem("token");

  const loadMorePublications = () => {
    setPage(page + 1);
  };

  const deletePublication = async (publicationId) => {
    const request = await fetch(
      `http://localhost:5000/api/publication/${publicationId}`,
      {
        method: "DELETE",
        headers: { "Content-type": "application/json", Authorization: token },
      }
    );
    const data = await request.json();
    if (data.success) {
      // Elimina la publicación borrada del estado publications
      setPublications((prevPublications) =>
        prevPublications.filter(
          (publication) => publication._id !== publicationId
        )
      );
    }
  };

  return (
    <>
      <div className="content__posts">
        {publications.map((publicacion) => (
          <article className="posts__post" key={publicacion._id}>
            <div className="post__container">
              <div className="post__image-user">
                <Link to="#" className="post__image-link">
                  {auth.image && auth.image !== "default.png" ? (
                    <img
                      src={`http://localhost:5000/api/upload/${auth.image}`}
                      className="list-end__img"
                      alt="Foto de perfil"
                    />
                  ) : (
                    <img
                      src={avatar}
                      className="list-end__img"
                      alt="Foto de perfil"
                    />
                  )}
                </Link>
              </div>
              <div className="post__body">
                <div className="post__user-info">
                  <Link to="#" className="user-info__name">
                    {auth.name}
                  </Link>
                  <span className="user-info__divider"> | </span>
                  <span className="user-info__create-date">
                    {formatDate(publicacion.created_at)}
                  </span>
                </div>
                <h4 className="post__content">{publicacion.text}</h4>
              </div>
            </div>

            <div className="post__buttons">
              <button
                onClick={() => deletePublication(publicacion._id)}
                className="post__button"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="content__container-btn">
        {!loading && publications.length > 0 ? (
          <button
            className="content__btn-more-post"
            onClick={loadMorePublications}
          >
            Ver más publicaciones
          </button>
        ) : null}
      </div>
    </>
  );
};
