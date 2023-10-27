import React from "react";
import avatar from "../../assets/img/user.png";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const PublicationList = ({
  publications,
  page,
  setPage,
  loading,
  showLoadMoreButton,
}) => {
  const { auth } = useAuth();

  const loadMorePublications = () => {
    setPage(page + 1);
  };


  return (
    <div className="fondo-perfil">
      <div className="layout">
        <div className="content__po">
          {publications.map((publicacion) => (
            <article className="posts__post" key={publicacion._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link
                    to={`/perfil/${publicacion.user._id}`}
                    className="post__image-link"
                  >
                    {publicacion.user.image &&
                    publicacion.user.image !== "default.png" ? (
                      <img
                        src={`http://localhost:5000/api/upload/${publicacion.user.image}`}
                        className="list-end__img2"
                        alt="Foto de perfil"
                      />
                    ) : (
                      <img
                        src={avatar}
                        className="list-end__img2"
                        alt="Foto de perfil"
                      />
                    )}
                  </Link>
                </div>
                <div className="post__body">
                  <div className="post__user-info">
                    <Link className="user-info__name">
                      {publicacion.user.name}
                    </Link>
                  </div>
                  <h4 className="post__content">{publicacion.text}</h4>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div>
          {!loading && publications.length > 0 && showLoadMoreButton ? (
            <button
              className="content__btn-more-post"
              onClick={loadMorePublications}
            >
              Ver más publicaciones
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
