import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";
import { useParams } from "react-router-dom";

export const Feed = () => {
  const params = useParams();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPublications, setTotalPublications] = useState(0);
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    getPublications();
  }, [params, page]);

  const getPublications = async (nextPage = 1) => {
    setLoading(true);
    const request = await fetch(
      `http://localhost:5000/api/feed/${nextPage}`,
      {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: token },
      }
    );
    const data = await request.json();
    console.log(data);
  
    if (data.success) {
      if (data.publicaciones && Array.isArray(data.publicaciones)) {
        const formattedPublications = data.publicaciones.map((publication) => ({
          ...publication,
          createdAt: formatDate(publication.createdAt),
        }));
  
        if (page === 1) {
          // Si es la primera página, establece el número total de publicaciones
          setTotalPublications(data.total);
          // y establece las primeras 5 publicaciones
          setPublications(formattedPublications.slice(0, 5));
        } else {
          // Si no es la primera página, agrega las siguientes 5 publicaciones
          setPublications((prevPublications) => [
            ...prevPublications,
            ...formattedPublications.slice(
              prevPublications.length,
              prevPublications.length + 5
            ),
          ]);
        }
      } else {
        // Si data.publicaciones no es un array, maneja el caso de error aquí.
        // Puedes mostrar un mensaje de error o tomar la acción apropiada.
      }
  
      setLoading(false);
    } else {
      // Si no hay publicaciones disponibles, establece publications en un array vacío
      setPublications([]);
      setLoading(false);
    }
  };
  
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button">Mostrar nuevas</button>
      </header>

      <PublicationList
        publications={publications}
        setPublications={setPublications}
        page={page}
        setPage={setPage}
        loading={loading}
      />
    </>
  );
};
