import React from "react";
import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { Login } from "../components/user/Login";
import { Register } from "../components/user/Register";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { Feed } from "../components/publication/Feed";
import { AuthProvider } from "../context/AuthProvider";
import { Logout } from "../components/user/Logout";
import { People } from "../components/user/People";
import { Config } from "../components/user/Config";
import { Portada } from "../Portada";
import { Following } from "../components/follow/Following";
import { Followers } from "../components/follow/Followers";
import { Profile } from "../components/user/Profile";
import { Timeline } from "../components/publication/Timeline";
import { BandejaEntrada } from "../components/send/BandejaEntrada";
import { Modificacion } from "../components/user/configuration/Modificacion";
import Privacidad from "../components/user/configuration/Privacidad";

export const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Portada />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
            </Route>

            <Route path="/social" element={<PrivateLayout />}>
              <Route index element={<Feed />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="timeline/:id" element={<Timeline />} />
              <Route path="logout" element={<Logout />} />
              <Route path="gente" element={<People />} />
              <Route path="ajustes" element={<Config />} />
              <Route path="privacidad" element={<Privacidad/>}/>
              <Route path="mod" element={<Modificacion/>}/>
              <Route path="bandeja" element={<BandejaEntrada />} />
              <Route path="siguiendo/:userId" element={<Following />} />
              <Route path="seguidores/:userId" element={<Followers />} />
              <Route path="perfil/:userId" element={<Profile />} />
            </Route>

            <Route
              path="*"
              element={
                <>
                  <p>
                    <h1>404 PAge Not Found</h1>
                    <Link to="/">Volver a Inicio</Link>
                  </p>
                </>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};
