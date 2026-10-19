import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

import logoF1Hub from "../../assets/logo-f1hub.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">

        <NavLink to="/" className="navbar-logo">
          <img
            src={logoF1Hub}
            alt="F1 HUB"
            className="navbar-logo-image"
          />
        </NavLink>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Fechar menu" : "Abrir menu"
          }
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        <nav
          className={`navbar-menu ${
            menuOpen ? "open" : ""
          }`}
        >
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/calendar"
            onClick={() => setMenuOpen(false)}
          >
            Calendário
          </NavLink>

          <NavLink
            to="/standings"
            onClick={() => setMenuOpen(false)}
          >
            Classificação
          </NavLink>

          <NavLink
            to="/drivers"
            onClick={() => setMenuOpen(false)}
          >
            Pilotos
          </NavLink>

          <NavLink
            to="/teams"
            onClick={() => setMenuOpen(false)}
          >
            Equipes
          </NavLink>

      
        </nav>

      </div>
    </header>
  );
}

export default Navbar;