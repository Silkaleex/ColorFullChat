import React from "react";
import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <>
      <nav className="navbar__container-lists">
        <ul className="container-lists__menu-list">
          <li className="menu-list__item">
            <Link to="/login" className="menu-list__link">
              <i className="fa-solid fa-user"></i>
              <span className="menu-list__title">Login</span>
            </Link>
          </li>

          <li className="menu-list__item">
            <Link to="/registro" className="menu-list__link">
              <i className="fa-solid fa-users"></i>
              <span className="menu-list__title">Registro</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
