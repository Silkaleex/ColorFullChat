import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";

export const People = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]); // Estado para almacenar una lista de usuarios.
  const [page, setPage] = useState(1); // Estado para controlar la página actual.
  const [loading, setLoading] = useState(true); // Estado para controlar si se están cargando datos.
  const [more, setMore] = useState(true); // Estado para controlar si hay más usuarios para cargar.
  const [following, setFollowing] = useState([]); // Estado para almacenar la lista de usuarios seguidos.
  const token = localStorage.getItem("token"); // Obtener el token de autenticación del almacenamiento local del navegador.

  useEffect(() => {
    // Efecto secundario que se ejecuta cuando el componente se monta.
    getUsers(); // Llama a la función getUsers para obtener la lista de usuarios.
  }, []);

  const getUsers = async (nextPage = 1) => {
    // Función asincrónica para obtener la lista de usuarios.
    setLoading(true); // Establecer el estado de carga en true.

    try {
      const request = await fetch(
        `http://localhost:5000/api/list/${nextPage}`, // Realiza una solicitud GET al servidor para obtener la lista de usuarios.
        {
          method: "GET",
          headers: { "Content-type": "application/json", Authorization: token }, // Configura las cabeceras de la solicitud con el token de autorización.
        }
      );
      const data = await request.json(); // Convierte la respuesta del servidor en formato JSON.
      console.log(data); // Imprime los datos en la consola.

      if (data.status === "success") {
        // Si la respuesta del servidor es exitosa:
        let newUsers = data.users; // Obtiene la lista de usuarios del servidor.
        const followingIds = data.following.map((user) => user._id); // Obtiene los IDs de los usuarios seguidos.
        setFollowing(followingIds); // Actualiza el estado "following" con los IDs de los usuarios seguidos.

        if (users.length >= 1) {
          // Si ya hay usuarios en el estado local:
          newUsers = [...users, ...data.users]; // Combina los nuevos usuarios con los existentes.
        }
        setUsers(newUsers); // Actualiza el estado "users" con la nueva lista de usuarios.

        // paginación
        if (users.length >= data.total - data.users.length) {
          // Comprueba si se han cargado todos los usuarios.
          setMore(false); // Si todos los usuarios se han cargado, establece "more" en false.
        }
      }
    } catch (error) {
      console.error("Algo no funcionó correctamente", error);
    } finally {
      setLoading(false); // Establece el estado de carga en false, independientemente del resultado de la solicitud.
    }
  };

  const nextPage = () => {
    // Función para cargar la siguiente página de usuarios.
    let next = page + 1; // Calcula el número de la siguiente página.
    setPage(next); // Actualiza el estado de la página actual.
    getUsers(next); // Llama a getUsers para obtener la siguiente página de usuarios.
  };

  const follow = async (userId) => {
    // Función para seguir a un usuario.
    try {
      // Actualizar el estado de following inmediatamente
      setFollowing((prevFollowing) => [...prevFollowing, userId]); // Agrega el ID del usuario seguido al estado "following".

      const request = await fetch(
        `http://localhost:5000/api/follow/${userId}`, // Realiza una solicitud POST al servidor para seguir al usuario.
        {
          method: "POST",
          body: JSON.stringify({ followed: userId }), // Envía el ID del usuario a seguir en el cuerpo de la solicitud.
          headers: {
            "Content-type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = await request.json(); // Convierte la respuesta del servidor en formato JSON.
      console.log(data); // Imprime los datos en la consola.

      if (data.status === "success") {
        // Si la respuesta del servidor es exitosa, no es necesario realizar más acciones ya que el estado local ya se ha actualizado.
        // No es necesario hacer nada más, ya que el estado local ya se ha actualizado
      }
    } catch (error) {
      console.error("No pudiste seguir a ese usuario", error); // Manejo de errores en caso de que la solicitud falle.
      // Si hay un error, debes revertir el cambio en el estado de following
      setFollowing((prevFollowing) =>
        prevFollowing.filter(
          (followingUserId) => followingUserId !== userId.toString() // Elimina el ID del usuario seguido del estado "following".
        )
      );
    }
  };

  const unfollow = async (userId) => {
    // Función para dejar de seguir a un usuario.
    try {
      const request = await fetch(
        `http://localhost:5000/api/unfollow/${userId}`, // Realiza una solicitud DELETE al servidor para dejar de seguir al usuario.
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = await request.json(); // Convierte la respuesta del servidor en formato JSON.
      console.log(data); // Imprime los datos en la consola.

      if (data.status === "success") {
        // Si la respuesta del servidor es exitosa:
        // Actualizar el estado de following inmediatamente usando una función
        setFollowing((prevFollowing) =>
          prevFollowing.filter(
            (followingUserId) => followingUserId !== userId.toString() // Elimina el ID del usuario seguido del estado "following".
          )
        );
      }
    } catch (error) {
      console.error("No pudiste dejar de seguir a ese usuario", error); // Manejo de errores en caso de que la solicitud falle.
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
                      {user.name} {user.surname}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <Link to="#" className="user-info__create-date">
                      {user.created_at}
                    </Link>
                  </div>
                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>
              {/* Solo muestra los botones cuando el usuario no es con el que me estoy identificando */}
              {user._id != auth._id && (
                <div className="post__buttons">
                  {!following.includes(user._id) && (
                    <button
                      className="post__button post__button--green"
                      onClick={() => follow(user._id)}
                    >
                      Seguir
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
      </div>
      {!loading && more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas Personas
          </button>
        </div>
      )}
      </div>
    </>
  );
};
