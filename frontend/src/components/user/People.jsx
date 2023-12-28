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

  const follow = async (user) => {
    try {
      if (!user || !user._id) {
        console.error("No se proporcionó un usuario válido");
        return;
      }

      if (user.isPrivate) {
        // Si el usuario es privado, enviar una solicitud de amistad
        const request = await fetch(
          `http://localhost:5000/api/peticion/${user._id}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: token,
            },
          }
        );
        const data = await request.json();

        if (data.success) {
          // Actualizar las solicitudes pendientes solo si la solicitud se envió correctamente
          setPendingRequests([...pendingRequests, user._id]);
        } else {
          console.error("Error al enviar la solicitud de amistad", data.message);
        }
      } else {
        // Si el usuario es público, seguirlo directamente
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
    } catch (error) {
      console.error("No pudiste seguir a ese usuario", error);
    }
  };

  const unfollow = async (userId) => {
    try {
      const request = await fetch(
        `http://localhost:5000/api/unfollow/${userId}`,
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
            (followingUserId) => followingUserId !== userId.toString()
          )
        );
      }
    } catch (error) {
      console.error("No pudiste dejar de seguir a ese usuario", error);
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
            <p className="loading__users">
              Cargando usuarios
              <br />
              <span className="loader"></span>
            </p>
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
                    {!following.includes(user._id) && (
                      <button
                        className="post__button post__button--green"
                        onClick={() => follow(user)}
                      >
                        {user.isPrivate && pendingRequests.includes(user._id)
                          ? "Petición Pendiente"
                          : "Seguir"}
                      </button>
                    )}
  
                    {following.includes(user._id) && (
                      <button
                        className="post__button post__button--red"
                        onClick={() => unfollow(user._id)}
                      >
                        Dejar de Seguir
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
          {!loading && more && (
            <div className="content__container-btn">
              <button className="content__btn-more-post" onClick={nextPage}>
                Ver mas Personas
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
          }  