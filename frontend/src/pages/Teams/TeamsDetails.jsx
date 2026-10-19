import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Trophy, Users } from "lucide-react";
import { TEAM_DATA, DRIVER_DETAILS } from "./TeamsData";
import "./TeamDetails.css";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getTeam(teamId) {
  const normalizedId = normalize(teamId);

  return TEAM_DATA.find((team) => {
    const id = normalize(team.id);
    const name = normalize(team.name);

    return (
      id === normalizedId ||
      name === normalizedId ||
      id.includes(normalizedId) ||
      normalizedId.includes(id)
    );
  });
}

export default function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const team = getTeam(teamId);

  if (!team) {
    return (
      <main className="team-details-not-found">
        <h1>Equipe não encontrada</h1>
        <button onClick={() => navigate("/teams")}>Voltar para equipes</button>
      </main>
    );
  }

  const color = team.color || "#E10600";
  const drivers = team.drivers || [];

  return (
    <main
      className="team-details"
      style={{
        "--team-color": color,
        "--team-dark": team.dark || "#15171B",
      }}
    >
      <nav className="team-details-nav">
        <button
          className="team-details-back"
          onClick={() => navigate("/teams")}
        >
          <ArrowLeft size={17} />
          <span>Voltar</span>
        </button>
      </nav>

      <section className="team-details-hero">
        <div className="team-details-hero-pattern" />

        <div className="team-details-hero-top">
          <span className="team-details-kicker">F1 HUB / 2026</span>

          <span className="team-details-season">
            FIA FORMULA ONE WORLD CHAMPIONSHIP
          </span>
        </div>

        <div className="team-details-car-wrap">
          {team.car ? (
            <img
              className="team-details-car"
              src={team.car}
              alt={`Carro da equipe ${team.name}`}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="team-details-car-placeholder">{team.name}</div>
          )}
        </div>

        <div className="team-details-name-band">
          <span className="team-details-band-line" />

          <h1>{team.name}</h1>

          <span className="team-details-band-line" />
        </div>

        <div className="team-details-hero-info">
          <div className="team-details-driver-names">
            {drivers.map((driver, index) => (
              <span key={driver}>
                {driver}
                {index < drivers.length - 1 && <i aria-hidden="true" />}
              </span>
            ))}
          </div>

          {team.logo && (
            <img
              className="team-details-logo"
              src={team.logo}
              alt={`Logo ${team.name}`}
            />
          )}
        </div>
      </section>

      <section className="team-details-content" id="drivers">
        <div className="team-details-section-header">
          <div>
            <span className="team-details-eyebrow">THE LINE-UP / 2026</span>
            <h2>
              DRIVERS<span>.</span>
            </h2>
          </div>

          <span className="team-details-section-index">01 — PILOTOS</span>
        </div>

        <div className="team-details-driver-grid">
          {drivers.map((driver, index) => {
            const details = DRIVER_DETAILS[driver] || {};

            return (
              <article
                className="team-details-driver-card"
                key={driver}
                style={{
                  "--driver-index": index,
                }}
              >
                <div className="team-details-driver-pattern" />

                <div className="team-details-driver-copy">
                  <span className="team-details-driver-label">
                    PILOTO 0{index + 1}
                  </span>

                  <h3>{driver}</h3>

                  <g>{team.name}</g>

                  <strong className="team-details-driver-number">
                    {details.number || "—"}
                  </strong>
                </div>

                <div className="team-details-driver-portrait">
                  <img
                    src={details.photo || ""}
                    alt={driver}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="team-details-driver-bottom">
                  <span className="team-details-driver-flag">
                    {details.flag || "🏁"}
                  </span>

                  <span>{details.country || "F1 DRIVER"}</span>

                  <ArrowUpRight size={18} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="team-details-stats" id="statistics">
        <div className="team-details-stat">
          <Trophy size={20} />
          <span>CAMPEONATO</span>
          <strong>2026</strong>
        </div>

        <div className="team-details-stat">
          <Users size={20} />
          <span>PILOTOS</span>
          <strong>{drivers.length.toString().padStart(2, "0")}</strong>
        </div>

        <div className="team-details-stat">
          <ArrowUpRight size={20} />
          <span>EQUIPE</span>
          <strong>{team.name}</strong>
        </div>
      </section>

      <section className="team-details-profile" id="team-profile">
        <div>
          <span className="team-details-eyebrow">BEHIND THE GRID</span>
          <h2>Mais que velocidade.</h2>
          <p>
            Engenharia, estratégia e trabalho em equipe. Explore a temporada de{" "}
            {team.name} no F1 HUB.
          </p>
        </div>

        {team.logo && <img src={team.logo} alt="" />}
      </section>

      <footer className="team-details-footer" id="team-news">
        <span>F1 HUB / 2026</span>
        <span>{team.name.toUpperCase()}</span>
        <button onClick={() => navigate("/teams")}>
          Todas as equipes <ArrowLeft size={15} />
        </button>
      </footer>
    </main>
  );
}
