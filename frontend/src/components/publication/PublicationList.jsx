import React, { useState, useEffect } from "react";
import avatar from "../../assets/img/user.png";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BsSuitHeart } from "react-icons/bs";

export const PublicationList = ({
  publications,
  page,
  setPage,
  loading,
  showLoadMoreButton,
}) => {
  const { auth } = useAuth();
  const [likeCounts, setLikeCounts] = useState({});

 const loadMorePublications = () => {
  setPage(page + 1);
};

  useEffect(() => {
    if (publications.length > 0) {
      const updatedLikeCounts = {};

      publications.forEach((publication) => {
        const initialCount = publication.likes ? publication.likes.length : 0;
        updatedLikeCounts[publication._id] = initialCount;

        getLikes(publication._id);
      });

      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        ...updatedLikeCounts,
      }));
    }
  }, [publications]);

  const updateLikeCount = (publicationId) => {
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [publicationId]: !prevCounts[publicationId], 
    }));
    
  };

const handleLikeAction = async (publicationId, action) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/publications/${publicationId}/likes`,
      {
        method: action === 'like' ? 'POST' : 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await response.json();
    
    if (data.success) {
      // Actualizar el estado inmediatamente después de la confirmación del servidor
      updateLikeCount(publicationId);

      // Refrescar la página después de 3 segundos solo si la acción fue exitosa
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      console.error(`Error al ${action === 'like' ? 'dar' : 'quitar'} like a la publicación`);
    }
  } catch (error) {
    console.error(`Error al ${action === 'like' ? 'dar' : 'quitar'} like a la publicación`, error);
  }
};

  const getLikes = async (publicationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/publications/${publicationId}/likes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await response.json();

      if (data.success) {
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [publicationId]: data.likes.length,
        }));
      } 
    } catch (error) {
      console.error("Error al obtener los likes", error);
    }
  };

  const iconColor = (publicationId) => {
    return likeCounts[publicationId] ? "icono_like_okey" : "icono_like";
  };

  return (
    <div className="fondo-perfil">
      <div className="layout">
        <div className="content__po">
          {publications.map((publicacion) => (
            <article className="posts__post" key={publicacion._id}>
              <div className="post__container">
                <div className="post__image-user2">
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
                  <h4 className="post__content2">{publicacion.text}</h4>
                </div>
              </div>
              <div className="megustas">
                <BsSuitHeart
                  className={iconColor(publicacion._id)}
                  onClick={() => handleLikeAction(publicacion._id, likeCounts[publicacion._id] ? 'unlike' : 'like')}
                />
                <span className="numeros_like">
                  {likeCounts[publicacion._id] !== undefined
                    ? likeCounts[publicacion._id]
                    : 0}
                </span>
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
