import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Sidebar } from "../layout/private/Sidebar";

function formatDate(dateString) {
  const currentDate = new Date();
  const publicationDate = new Date(dateString);

  const timeDifference = (currentDate - publicationDate) / (60 * 1000);

  if (timeDifference < 60) {
    return `Hace ${Math.floor(timeDifference)} minutos`;
  } else {
    const dd = String(publicationDate.getDate()).padStart(2, "0");
    const mm = String(publicationDate.getMonth() + 1).padStart(2, "0");
    const yyyy = publicationDate.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  }
}

export const Profile = () => {
  const params = useParams();
  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPublications, setTotalPublications] = useState(0); // Agregar estado para el número total de publicaciones
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true); // Inicialmente mostrar el botón

  const token = localStorage.getItem("token");

  useEffect(() => {
    getPublications();
  }, [params, page]);

  const getPublications = async () => {
    setLoading(true);
    const request = await fetch(
      `http://localhost:5000/api/list/${params.userId}/${page}`,
      {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: token },
      }
    );
    const data = await request.json();
    console.log(data);

    if (data.success) {
      const formattedPublications = data.publicaciones.map((publication) => ({
        ...publication,
        createdAt: formatDate(publication.createdAt),
      }));

      if (page === 1) {
        // Si es la primera página, establece el número total de publicaciones
        setTotalPublications(data.total); // Supongo que 'data.total' contiene el número total de publicaciones
        // y establece las primeras 5 publicaciones
        setPublications(formattedPublications.slice(0, 5));

        // Ocultar el botón si no hay más de 5 publicaciones
        setShowLoadMoreButton(data.total > 5);
      } else {
        // Si no es la primera página, agrega las siguientes 5 publicaciones
        setPublications((prevPublications) => [
          ...prevPublications,
          ...formattedPublications.slice(
            prevPublications.length,
            prevPublications.length + 5
          ),
        ]);

        // Ocultar el botón si no hay más publicaciones por cargar
        setShowLoadMoreButton(data.total < page * 5);
      }

      setLoading(false);
    } else {
      // Si no hay publicaciones disponibles, establece publications en un array vacío
      setPublications([]);
      setLoading(false);
    }
  };
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
    <div className="layout-barraLateral">
      <div >
        {publications.length === 0 && !loading ? (
          <div className="no-publications-card">
            <p>No tienes publicaciones que mostrar.</p>
          </div>
        ) : (
          <div className="fondo-perfil4">
            <div className="layout">
              <div className="content__po">
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
                          <Link className="user-info__name">
                            {auth.name} {auth.surname}
                          </Link>
                          <span className="user-info__divider"> | </span>
                          <span className="user-info__create-date">
                            {formatDate(auth.createdAt)}
                          </span>
                        </div>
                        <h4 className="post__content">{publicacion.text}</h4>
                        {publicacion.file && (
                          <img
                            src={`http://localhost:5000/api/media/${publicacion.file}`}
                            alt="Imagen de la publicación"
                          />
                        )}
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
        )}
      </div>
      <Sidebar />
      </div>
    </>
  );
};
