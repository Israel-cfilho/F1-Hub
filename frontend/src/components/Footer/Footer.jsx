import { NavLink } from "react-router-dom";
import "./Footer.css";

import logoF1Hub from "../../assets/logo-f1hub.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">

          <NavLink to="/" className="footer-logo">
            <img
              src={logoF1Hub}
              alt="F1 HUB"
              className="footer-logo-image"
            />
          </NavLink>

          <p>
            Acompanhe a Fórmula 1 em um só lugar.
            Calendário, pilotos, equipes, resultados
            e estatísticas.
          </p>

          <span className="footer-status">
            ● SYSTEM ONLINE
          </span>

        </div>

        <div className="footer-column">

          <h3>NAVEGAÇÃO</h3>

          <NavLink to="/">
            Dashboard
          </NavLink>

          <NavLink to="/calendar">
            Calendário
          </NavLink>

          <NavLink to="/standings">
            Classificação
          </NavLink>

          <NavLink to="/drivers">
            Pilotos
          </NavLink>

        </div>

        <div className="footer-column">

          <h3>CAMPEONATO</h3>

          <NavLink to="/teams">
            Equipes
          </NavLink>

          <NavLink to="/statistics">
            Estatísticas
          </NavLink>

          <NavLink to="/comparator">
            Comparador
          </NavLink>

          <NavLink to="/history">
            Histórico
          </NavLink>

        </div>

        <div className="footer-column">

          <h3>F1 HUB</h3>

          <span>
            Dados atualizados
          </span>

          <span>
            Temporada 2026
          </span>

          <span>
            Powered by Jolpica F1 API
          </span>

        </div>

      </div>

      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} F1 HUB
        </span>

        <span>
          BUILT FOR SPEED
        </span>

      </div>
    </footer>
  );
}

export default Footer;