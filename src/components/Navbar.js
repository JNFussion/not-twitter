import React from "react";
import {
  FaCogs,
  FaHashtag,
  FaListAlt,
  FaRegBell,
  FaRegBookmark,
  FaRegEnvelope,
  FaRegUser,
  FaTwitter,
} from "react-icons/fa";
import { RiHome7Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

function Navbar(params) {
  return (
    <nav>
      <Link to="/">
        <div className="w-fit my-1 p-4 hover:rounded-full hover:bg-blue-200">
          <FaTwitter className="text-3xl text-blue-500 " />
        </div>
      </Link>

      <ul className="grid gap-4 my-2">
        {[
          ["/", <RiHome7Fill />, "Inicio", true],
          ["/trending", <FaHashtag />, "Explorar"],
          ["/", <FaRegBell />, "Notificaciones"],
          ["/", <FaRegEnvelope />, "Mensajes"],
          ["/", <FaRegBookmark />, "Guardados"],
          ["/", <FaListAlt />, "Listas"],
          ["/", <FaRegUser />, "Perfil"],
          ["/", <FaCogs />, "Mas opciones"],
        ].map(([url, icon, text, selected]) => (
          <li>
            <Link
              to={url}
              className="w-fit flex items-center gap-4 px-4 py-2 text-xl trans-hover hover:bg-gray-200 hover:rounded-full"
            >
              <span className="text-2xl">{icon}</span>
              <span className={selected ? "font-bold" : ""}>{text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
