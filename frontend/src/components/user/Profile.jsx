import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";

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
  const {auth} = useAuth();
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
console.log(data)
  
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
    setShowLoadMoreButton(data.total > page * 5);
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
      {publications.length === 0 && !loading ? (
        <div className="no-publications-card">
          <p>No tienes publicaciones que mostrar.</p>
        </div>
      ) : (
        <PublicationList
          publications={publications}
          setPublications={setPublications}
          page={page}
          setPage={setPage}
          loading={loading}
          showLoadMoreButton={showLoadMoreButton} 
        />
      )}
    </>
  );
};
