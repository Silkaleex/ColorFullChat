import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";

export const Followers = () => {
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
        `http://localhost:5000/api/followers/${userId}/${nextPage}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json", Authorization: token },
        }
      );
      const data = await request.json();
      console.log(data);

      let cleanUsers = [];
      data.follows.forEach((follow) => {
        cleanUsers = [...cleanUsers, follow.user];
      });
      data.users = cleanUsers;

      if (data.status === "success") {
        let newUsers = data.users;
        const followingIds = data.following.map((user) => user._id);
        setFollowing(followingIds);

        if (users.length >= 1) {
          newUsers = [...users, ...data.users];
        }
        setUsers(newUsers);

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
    try {
      setFollowing((prevFollowing) => [...prevFollowing, userId]);
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
      }
    } catch (error) {
      console.error("No pudiste seguir a ese usuario", error);
      setFollowing((prevFollowing) =>
        prevFollowing.filter(
          (followingUserId) => followingUserId !== userId.toString()
        )
      );
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

      <div className="content__posts3">
        {loading ? (
          <p className="loading__users2">
            Cargando<span className="loader"></span>
          </p>
        ) : (
          users.map((user, index) => (
            <article className="posts__post4" key={index}>
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
