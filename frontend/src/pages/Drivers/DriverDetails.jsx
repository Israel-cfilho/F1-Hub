import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Flag,
  Gauge,
  Hash,
  Trophy,
  Users,
  CalendarDays,
  Zap,
} from "lucide-react";
import { DRIVER_DETAILS, TEAM_DATA } from "../Teams/TeamsData";

import api from "../../services/api";
import "./DriverDetails.css";

function DriverDetails() {
  const { driverId } = useParams();
  const navigate = useNavigate();

  const normalize = (value = "") =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const getTeamStyle = (teamName) => {
    const name = normalize(teamName);

    const team = TEAM_DATA.find((item) => {
      return (
        normalize(item.name) === name ||
        normalize(item.id) === name ||
        normalize(item.name).includes(name) ||
        name.includes(normalize(item.name))
      );
    });

    return {
      "--dd-team-color": team?.color || "#E10600",
      "--dd-team-dark": team?.dark || "#17191D",
    };
  };
  const getLocalDriverPhoto = (driverName) => {
    const normalize = (value = "") =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const entry = Object.entries(DRIVER_DETAILS).find(
      ([name]) => normalize(name) === normalize(driverName),
    );

    return entry?.[1]?.photo || "";
  };

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDriver() {
      setLoading(true);
      setError("");

      try {
        const [photosResponse, standingsResponse] = await Promise.all([
          api.get("/f1/drivers/photos"),
          api.get("/f1/standings/drivers"),
        ]);

        const photos = Array.isArray(photosResponse.data)
          ? photosResponse.data
          : [];

        const standings = Array.isArray(standingsResponse.data)
          ? standingsResponse.data
          : [];

        const photo = photos.find((item) => {
          const code = item.driverId || item.name_acronym || "";
          return code.toUpperCase() === driverId.toUpperCase();
        });

        const standing = standings.find((item) => {
          const d = item.Driver || item.driver;
          const code = d?.code || "";
          const id = d?.driverId || "";

          return (
            code.toUpperCase() === driverId.toUpperCase() ||
            id.toUpperCase() === driverId.toUpperCase()
          );
        });

        const d = standing?.Driver || standing?.driver;
        const team = standing?.Constructors?.[0] || standing?.constructors?.[0];

        if (!photo && !standing) {
          throw new Error("Não encontramos este piloto.");
        }

        const originalUrl = photo?.headshotUrl || photo?.headshot_url || "";
        const imageUrl = originalUrl
          ? originalUrl.replace(".transform/1col/image.png", "")
          : "";

        if (active) {
          setDriver({
            driverId:
              photo?.driverId || photo?.name_acronym || d?.code || driverId,
            name:
              photo?.name ||
              photo?.full_name ||
              `${d?.givenName || ""} ${d?.familyName || ""}`.trim() ||
              "Piloto",
            teamName:
              photo?.teamName ||
              photo?.team_name ||
              team?.name ||
              "Equipe não informada",
            headshotUrl: imageUrl || originalUrl,
            number:
              photo?.driverNumber ??
              photo?.driver_number ??
              d?.permanentNumber ??
              "--",
            position: Number(standing?.position || 0),
            points: Number(standing?.points || 0),
            wins: Number(standing?.wins || 0),
            nationality: d?.nationality || "Não informada",
            dateOfBirth: d?.dateOfBirth || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar piloto:", err);
        if (active) {
          setError(err.message || "Não foi possível carregar o perfil.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDriver();

    return () => {
      active = false;
    };
  }, [driverId]);

  const formatDate = (date) => {
    if (!date) return "Não informada";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const age = (() => {
    if (!driver?.dateOfBirth) return null;

    const birth = new Date(`${driver.dateOfBirth}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let value = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      value--;
    }

    return value;
  })();

  const teamStyle = getTeamStyle(driver?.teamName);

  if (loading) {
    return (
      <main className="driver-details-page">
        <div className="dd-loading">
          <span />
          <p>PREPARANDO PERFIL</p>
        </div>
      </main>
    );
  }

  if (error || !driver) {
    return (
      <main className="driver-details-page">
        <div className="dd-error">
          <span className="dd-kicker">F1 HUB / DRIVER DATABASE</span>
          <h1>Piloto não encontrado.</h1>
          <p>{error || "Não foi possível localizar este perfil."}</p>
          <button onClick={() => navigate("/drivers")}>
            <ArrowLeft size={17} /> VOLTAR AO GRID
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="driver-details-page" style={teamStyle}>
      <div className="dd-shell">
        <header className="dd-topbar">
          <button className="dd-back" onClick={() => navigate("/drivers")}>
            <ArrowLeft size={17} />
            <span>GRID DE PILOTOS</span>
          </button>

          <div className="dd-breadcrumb">
            F1 HUB <span>/</span> PILOTOS <span>/</span>{" "}
            <strong>{driver.driverId}</strong>
          </div>

          <span className="dd-season">SEASON 2026</span>
        </header>

        <section className="dd-profile">
          <div className="dd-profile-bg" />

          <div className="dd-vertical-label">DRIVER PROFILE — 2026</div>

          <div className="dd-main-info">
            <div className="dd-number">
              {String(driver.number).padStart(2, "0")}
            </div>

            <h1>
              {driver.name.split(" ").slice(0, -1).join(" ")}
              <br />
              <span>{driver.name.split(" ").slice(-1)}</span>
            </h1>

            <div className="dd-team-label">
              <span />
              {driver.teamName}
            </div>

            <p className="dd-profile-description">
              VELOCIDADE. PRECISÃO. PERFORMANCE.
              <br />
              Os números por trás do piloto.
            </p>
          </div>

          <div className="dd-photo-stage">
            <div className="dd-photo-ring" />
            <div className="dd-photo-caption">
              <span>#{driver.number}</span>
              <span>{driver.driverId}</span>
            </div>

            {getLocalDriverPhoto(driver.name) || driver.headshotUrl ? (
              <img
                className="dd-driver-photo"
                src={getLocalDriverPhoto(driver.name) || driver.headshotUrl}
                alt={`Foto de ${driver.name}`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="dd-no-photo">{driver.driverId}</div>
            )}
          </div>

          <div className="dd-profile-bottom">
            <span>F1 HUB / THE GRID</span>
            <span>01 — DRIVER DATA</span>
          </div>
        </section>

        <section className="dd-stats" id="dd-stats">
          <div className="dd-section-title">
            <div>
              <span className="dd-kicker">PERFORMANCE INDEX</span>
              <h2>Os números.</h2>
            </div>
            <span className="dd-section-index">01 / 03</span>
          </div>

          <div className="dd-stat-grid">
            <article className="dd-stat dd-stat-primary">
              <div className="dd-stat-top">
                <span>CAMPEONATO</span>
                <Gauge size={19} />
              </div>
              <strong>
                {driver.position > 0 ? `P${driver.position}` : "—"}
              </strong>
              <div className="dd-stat-bottom">
                <span>Posição atual</span>
                <ArrowUpRight size={17} />
              </div>
            </article>

            <article className="dd-stat">
              <div className="dd-stat-top">
                <span>PONTUAÇÃO</span>
                <Zap size={19} />
              </div>
              <strong>{driver.points}</strong>
              <div className="dd-stat-bottom">
                <span>Pontos conquistados</span>
                <span>PTS</span>
              </div>
            </article>

            <article className="dd-stat">
              <div className="dd-stat-top">
                <span>VITÓRIAS</span>
                <Trophy size={19} />
              </div>
              <strong>{driver.wins}</strong>
              <div className="dd-stat-bottom">
                <span>Na classificação disponível</span>
                <span>W</span>
              </div>
            </article>
          </div>
        </section>

        <section className="dd-bio">
          <div className="dd-section-title">
            <div>
              <span className="dd-kicker">BEHIND THE HELMET</span>
              <h2>Além da pista.</h2>
            </div>
            <span className="dd-section-index">02 / 03</span>
          </div>

          <div className="dd-bio-layout">
            <div className="dd-bio-heading">
              <span className="dd-bio-watermark">{driver.driverId}</span>
              <span className="dd-kicker">PILOTO / 2026</span>
              <h3>{driver.name}</h3>
              <p>{driver.teamName}</p>
            </div>

            <div className="dd-bio-details">
              <article>
                <div className="dd-detail-icon">
                  <Hash size={18} />
                </div>
                <div>
                  <span>NÚMERO DO CARRO</span>
                  <strong>{driver.number}</strong>
                </div>
              </article>

              <article>
                <div className="dd-detail-icon">
                  <Users size={18} />
                </div>
                <div>
                  <span>EQUIPE</span>
                  <strong>{driver.teamName}</strong>
                </div>
              </article>

              <article>
                <div className="dd-detail-icon">
                  <Flag size={18} />
                </div>
                <div>
                  <span>NACIONALIDADE</span>
                  <strong>{driver.nationality}</strong>
                </div>
              </article>

              <article>
                <div className="dd-detail-icon">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <span>DATA DE NASCIMENTO</span>
                  <strong>{formatDate(driver.dateOfBirth)}</strong>
                  {age !== null && <small>{age} anos</small>}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="dd-team-banner">
          <div className="dd-team-banner-icon">
            <Users size={23} />
          </div>

          <div>
            <span className="dd-kicker">CONSTRUTORES / 2026</span>
            <h2>{driver.teamName}</h2>
            <p>Equipe associada ao piloto na classificação disponível.</p>
          </div>

          <span className="dd-team-banner-code">{driver.driverId}</span>
        </section>

        <footer className="dd-footer">
          <div className="dd-footer-brand">
            F1 <span>HUB</span>
          </div>

          <p>Dados fornecidos pelas APIs integradas ao projeto.</p>

          <button onClick={() => navigate("/drivers")}>
            VOLTAR AO GRID <ArrowLeft size={16} />
          </button>
        </footer>
      </div>
    </main>
  );
}

export default DriverDetails;
