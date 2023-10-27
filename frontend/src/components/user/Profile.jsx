import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Sidebar } from "../layout/private/Sidebar";

export const Profile = () => {
  const params = useParams();
  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPublications, setTotalPublications] = useState(0);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false); // Inicialmente, no se muestra
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
      }));

      if (page === 1) {
        setTotalPublications(data.total);
        setPublications(formattedPublications.slice(0, 5));
      } else {
        setPublications((prevPublications) => [
          ...prevPublications,
          ...formattedPublications.slice(
            prevPublications.length,
            prevPublications.length + 5
          ),
        ]);
      }

      // Mostrar el botón "Mostrar más" solo si hay al menos 5 publicaciones en el array
      setShowLoadMoreButton(formattedPublications.length >= 5);

      setLoading(false);
    } else {
      setPublications([]);
      setLoading(false);
    }
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
      setPublications((prevPublications) =>
        prevPublications.filter(
          (publication) => publication._id !== publicationId
        )
      );
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const loadMorePublications = () => {
    setPage(page + 1);
    getPublications();
  };

  return (
    <>
      <div className="layout-barraLateral">
        <div>
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
              </div>
            </div>
          )}
        </div>
        <Sidebar />
      </div>

      {showLoadMoreButton && (
        <div>
          <button className="load-more-button" onClick={loadMorePublications}>Mostrar más publicaciones</button>
        </div>
      )}
    </>
  );
};
