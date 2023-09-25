import React from "react";
import avatar from "../../assets/img/user.png";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const PublicationList = (
{  publications,
  setPublications,
  page,
  setPage,
  loading,}
) => {
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
                <a to="#" className="post__image-link">
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
                </a>
              </div>
              <div className="post__body">
                <div className="post__user-info">
                  <Link to="#" className="user-info__name">
                    {auth.name}
                  </Link>
                  <span className="user-info__divider"> | </span>
                  <span className="user-info__create-date">
                    {publicacion.createdAt}
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
