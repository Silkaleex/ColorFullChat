import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";

export const People = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false); // Mover aquí
  const token = localStorage.getItem("token");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async (nextPage = 1) => {
    setLoading(true);

    try {
      const request = await fetch(
        `http://localhost:5000/api/list/${nextPage}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json", Authorization: token },
        }
      );
      const data = await request.json();

      if (data.status === "success") {
        let newUsers = data.users;
        const followingIds = data.following.map((user) => user._id);
        setFollowing(followingIds);
        setUsers([...users, ...data.users]);
        setMore(users.length < data.total - data.users.length);
      }
    } catch (error) {
      console.error("Algo no funcionó correctamente", error);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
  };

  const toggleFollow = async (user) => {
    try {
      // Desactivar el botón al hacer clic
      setButtonDisabled(true);
  
      if (!user || !user._id) {
        console.error("No se proporcionó un usuario válido");
        return;
      }
  
      if (following.includes(user._id)) {
        // Si ya está siguiendo al usuario, dejar de seguir
        const request = await fetch(
          `http://localhost:5000/api/unfollow/${user._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Authorization: token,
            },
          }
        );
        const data = await request.json();
  
        if (data.status === "success") {
          setFollowing((prevFollowing) =>
            prevFollowing.filter(
              (followingUserId) => followingUserId !== user._id.toString()
            )
          );
        }
      } else {
        // Si no está siguiendo al usuario, seguirlo
        const request = await fetch(
          `http://localhost:5000/api/follow/${user._id}`,
          {
            method: "POST",
            body: JSON.stringify({ followed: user._id }),
            headers: {
              "Content-type": "application/json",
              Authorization: token,
            },
          }
        );
        const data = await request.json();
  
        if (data.status === "success") {
          setFollowing([...following, user._id]);
        }
      }
  
      // Recargar la página después de seguir/dejar de seguir
      window.location.reload();
    } catch (error) {
      console.error(
        "No se pudo realizar la acción de seguir/dejar de seguir",
        error
      );
    } finally {
      setButtonDisabled(true);
    }
  };
  return (
    <>
      <div className="fondo-perfil2">
        <header className="content__header">
          <h1 className="content__title">Usuarios</h1>
        </header>
        <div className="content__pos">
          {loading ? (
            <h2 className="loading__users">
              Cargando<span className="loader"></span>
            </h2>
          ) : (
            users.map((user, index) => (
              <article className="posts__post2" key={index}>
                <div className="post__container">
                  <div className="post__image-user">
                    <Link to="#" className="post__image-link">
                      {user.image && user.image !== "default.png" ? (
                        <img
                          src={`http://localhost:5000/api/upload/${user.image}`}
                          className="post__user-image"
                          alt="Foto de perfil"
                        />
                      ) : (
                        <img
                          src={avatar}
                          className="post__user-image"
                          alt="Foto de perfil"
                        />
                      )}
                    </Link>
                  </div>

                  <div className="post__body">
                    <div className="post__user-info">
                      <Link to="#" className="user-info__name">
                        {user.name} {user.surname}
                      </Link>
                    </div>
                    <h4 className="post__content">{user.bio}</h4>
                  </div>
                </div>
                {/* Solo muestra los botones cuando el usuario no es con el que me estoy identificando */}
                {user._id !== auth._id && (
                  <div className="post__buttons">
                    <button
                      className={`post__button ${following.includes(user._id) ? 'post__button--red' : 'post__button--green'}`}
                      onClick={() => toggleFollow(user)}
                      disabled={buttonDisabled}
                    >
                      {following.includes(user._id) ? 'Dejar de Seguir' : 'Seguir'}
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
          {!loading && more && (
            <div className="content__container-btn">
              <button className="content__btn-more-post" onClick={nextPage}>
                Ver más Personas
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
