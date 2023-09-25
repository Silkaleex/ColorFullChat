import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";

export const Following = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const token = localStorage.getItem("token");
  const params = useParams();
  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {
    setLoading(true);

    try {
      const userId = params.userId;
      const request = await fetch(
        `http://localhost:5000/api/following/${userId}/${nextPage}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json", Authorization: token },
        }
      );
      const data = await request.json();
      console.log(data);
      // recorrer y limpiar todos los follows para quedarme en followed
      let cleanUsers = [];
      data.follows.forEach((follow) => {
        cleanUsers = [...cleanUsers, follow.followed];
      });
      data.users = cleanUsers;
      console.log(data.users);
      if (data.users && data.status === "success") {
        let newUsers = data.users;

        if (users.length >= 1) {
          newUsers = [...users, ...data.users];
        }

        setUsers(newUsers);
        setFollowing(data.following);
        setLoading(false);

        if (users.length >= data.total - data.users.length) {
          setMore(false);
        }
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

  const follow = async (userId) => {
    // Verificar si ya estás siguiendo a este usuario
    if (following.includes(userId)) {
      console.log("Ya estás siguiendo a este usuario");
      return;
    }

    try {
      const request = await fetch(
        `http://localhost:5000/api/follow/${userId}`,
        {
          method: "POST",
          body: JSON.stringify({ followed: userId }),
          headers: {
            "Content-type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = await request.json();
      console.log(data);

      if (data.status === "success") {
        setFollowing((prevFollowing) => [...prevFollowing, userId]);
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
      console.log(data);

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
      <header className="content__header">
        <h1 className="content__title">Usuarios que te sigen</h1>
      </header>

      <div className="content__posts">
        {loading ? (
          <p className="loading__users">
            Cargando usuarios
            <br />
            <span className="loader"></span>
          </p>
        ) : (
          users.map((user, index) => (
            <article className="posts__post" key={index}>
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
                      {user.name} {user.surname}{" "}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <Link to="#" className="user-info__create-date">
                      {user.created_at}{" "}
                    </Link>
                  </div>
                  <h4 className="post__content">{user.bio}</h4>{" "}
                </div>
              </div>
              {/* Solo muestra los botones cuando el usuario no es con el que me estoy identificando */}
              {user._id != auth._id && (
                <div className="post__buttons">
                  {following.includes(user._id) && (
                    <button
                      className="post__button post__button--green"
                      onClick={() => follow(user._id)}
                    >
                      Seguir
                    </button>
                  )}

                  {!following.includes(user._id) && (
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
      </div>
      {!loading && more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas Personas
          </button>
        </div>
      )}
    </>
  );
};
