import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowUpRight,
  ChevronRight,
  Flag,
  Trophy,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import { DRIVER_DETAILS, TEAM_DATA } from "../Teams/TeamsData";

import api from "../../services/api";
import "./Drivers.css";

function Drivers() {
  const navigate = useNavigate();
  
  const getTeamStyle = (teamName) => {
    const normalize = (value = "") =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    const name = normalize(teamName);

    const aliases = {
      redbull: "redbullracing",
      rb: "racingbulls",
      astonmartin: "astonmartin",
    };

    const normalizedName = aliases[name] || name;

    const team = TEAM_DATA.find((item) => {
      const teamId = normalize(item.id);
      const teamLabel = normalize(item.name);

      return (
        teamId === normalizedName ||
        teamLabel === normalizedName ||
        teamLabel.includes(normalizedName) ||
        normalizedName.includes(teamLabel)
      );
    });

    return {
      "--driver-team-color": team?.color || "#E10600",
      "--driver-team-dark": team?.dark || "#17191D",
    };
  };
  const getLocalDriverPhoto = (driverName) => {
    const normalizedName = driverName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const driverDetails = Object.entries(DRIVER_DETAILS).find(
      ([name]) =>
        name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() === normalizedName,
    );


    return driverDetails?.[1]?.photo || "";
  };

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Todas");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDrivers() {
      try {
        const [photosResponse, standingsResponse] = await Promise.all([
          api.get("/f1/drivers/photos"),
          api.get("/f1/standings/drivers"),
        ]);

        const rawPhotos = Array.isArray(photosResponse.data)
          ? photosResponse.data
          : [];

        const standings = Array.isArray(standingsResponse.data)
          ? standingsResponse.data
          : [];

        const photos = rawPhotos.map((photo) => {
          const originalUrl = photo.headshotUrl || photo.headshot_url || "";

          const headshotUrl = originalUrl
            ? originalUrl.replace(".transform/1col/image.png", "")
            : "";

          return {
            ...photo,
            driverId: photo.driverId || photo.name_acronym || "",
            name: photo.name || photo.full_name || "",
            teamName: photo.teamName || photo.team_name || "",
            headshotUrl,
            driverNumber: photo.driverNumber ?? photo.driver_number,
          };
        });

        const mergedDrivers = photos.map((photo) => {
          const standing = standings.find((item) => {
            const driver = item.Driver || item.driver;
            const code = driver?.code || "";
            const id = driver?.driverId || "";

            return (
              code.toUpperCase() === photo.driverId.toUpperCase() ||
              id.toUpperCase() === photo.driverId.toUpperCase()
            );
          });

          const driver = standing?.Driver || standing?.driver;

          const constructor =
            standing?.Constructors?.[0] || standing?.constructors?.[0];

          return {
            ...photo,
            name:
              photo.name ||
              `${driver?.givenName || ""} ${driver?.familyName || ""}`.trim() ||
              "Piloto",
            teamName:
              photo.teamName || constructor?.name || "Equipe não informada",
            number: photo.driverNumber ?? driver?.permanentNumber ?? "--",
            position: Number(standing?.position || 0),
            points: Number(standing?.points || 0),
            wins: Number(standing?.wins || 0),
          };
        });

        if (active) {
          setDrivers(mergedDrivers);
        }
      } catch (error) {
        console.error("Erro ao carregar pilotos:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDrivers();

    return () => {
      active = false;
    };
  }, []);

  const teams = useMemo(
    () => [
      "Todas",
      ...new Set(drivers.map((driver) => driver.teamName).filter(Boolean)),
    ],
    [drivers],
  );

  const filteredDrivers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesSearch =
        !term ||
        driver.name.toLowerCase().includes(term) ||
        driver.driverId.toLowerCase().includes(term) ||
        driver.teamName.toLowerCase().includes(term);

      const matchesTeam =
        selectedTeam === "Todas" || driver.teamName === selectedTeam;

      return matchesSearch && matchesTeam;
    });
  }, [drivers, search, selectedTeam]);

  const featured = drivers[featuredIndex] || drivers[0];

  const openDriver = (driver) => {
    navigate(`/drivers/${driver.driverId}`);
  };

  const changeFeatured = (driver) => {
    const index = drivers.findIndex(
      (item) => item.driverId === driver.driverId,
    );

    if (index >= 0) setFeaturedIndex(index);
  };

  if (loading) {
    return (
      <main className="drivers-page">
        <div className="drivers-loading">
          <span />
          <p>CARREGANDO GRID DE PILOTOS</p>
        </div>
      </main>
    );
  }

  return (
    <main className="drivers-page">
      <div className="drivers-shell">
        <header className="drivers-topbar">
          <div className="drivers-brand">
            F1 <span>HUB</span>
          </div>

          <div className="drivers-breadcrumb">
            DATABASE <span>/</span> PILOTOS
          </div>

          <span className="drivers-season">SEASON 2026</span>
        </header>

        <section className="drivers-intro">
          <div>
            <span className="drivers-kicker">
              <span className="drivers-live-dot" />
              THE OFFICIAL GRID
            </span>

            <h1>
              THE
              <br />
              <span>DRIVERS.</span>
            </h1>

            <p>
              Vinte e dois lugares. Uma única linha de chegada. Conheça quem faz
              a história da Fórmula 1.
            </p>
          </div>

          <div className="drivers-intro-index">
            <span>GRID / 2026</span>
            <strong>{String(drivers.length).padStart(2, "0")}</strong>
            <span>PILOTOS MAPEADOS</span>
          </div>
        </section>

        {featured && (
          <section className="drivers-featured">
            <div className="drivers-featured-bg" />

            <div className="drivers-featured-copy">
              <span className="drivers-kicker">DRIVER SPOTLIGHT / 001</span>

              <span className="drivers-featured-number">
                {String(featured.number).padStart(2, "0")}
              </span>

              <span className="drivers-featured-code">{featured.driverId}</span>

              <h2>{featured.name}</h2>

              <div className="drivers-featured-team">
                <span />
                {featured.teamName}
              </div>

              <div className="drivers-featured-stats">
                <div>
                  <span>POSIÇÃO</span>
                  <strong>
                    {featured.position > 0 ? `P${featured.position}` : "—"}
                  </strong>
                </div>

                <div>
                  <span>PONTOS</span>
                  <strong>{featured.points}</strong>
                </div>

                <div>
                  <span>VITÓRIAS</span>
                  <strong>{featured.wins}</strong>
                </div>
              </div>

              <button
                type="button"
                className="drivers-featured-button"
                onClick={() => openDriver(featured)}
              >
                EXPLORAR PERFIL
                <ArrowUpRight size={18} />
              </button>
            </div>

            <div className="drivers-featured-photo-area">
              <div className="drivers-featured-ring" />

              {featured.headshotUrl && (
                <img
                  src={
                    getLocalDriverPhoto(featured.name) || featured.headshotUrl
                  }
                  alt={featured.name}
                  className="drivers-featured-photo"
                />
              )}

              <span className="drivers-featured-photo-code">
                #{featured.number}
              </span>
            </div>

            <div className="drivers-featured-footer">
              <span>F1 HUB / DRIVER SPOTLIGHT</span>
              <span>01 — {featured.driverId}</span>
            </div>
          </section>
        )}

        <section className="drivers-directory">
          <div className="drivers-section-heading">
            <div>
              <span className="drivers-kicker">THE LINE-UP</span>
              <h2>
                Conheça o grid<span>.</span>
              </h2>
              <p>Explore cada piloto e seus números na temporada.</p>
            </div>

            <div className="drivers-directory-count">
              <strong>{String(filteredDrivers.length).padStart(2, "0")}</strong>
              <span>RESULTADOS</span>
            </div>
          </div>

          <div className="drivers-toolbar">
            <label className="drivers-search">
              <Search size={18} />

              <input
                type="search"
                placeholder="Buscar piloto, código ou equipe..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <div className="drivers-filter-label">
              <SlidersHorizontal size={15} />
              <span>FILTRAR EQUIPE</span>
            </div>

            <div className="drivers-filters">
              {teams.map((team) => (
                <button
                  type="button"
                  key={team}
                  className={selectedTeam === team ? "active" : ""}
                  onClick={() => setSelectedTeam(team)}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>

          <div className="drivers-grid-heading">
            <span>01 / PILOTOS</span>
            <span>PERFORMANCE / 2026</span>
          </div>

          <div className="drivers-grid">
            {filteredDrivers.map((driver, index) => (
              <article
                className="driver-card"
                key={driver.driverId || driver.number || index}
                onMouseEnter={() => changeFeatured(driver)}
                style={getTeamStyle(driver.teamName)}
              >
                <button
                  type="button"
                  className="driver-card-open"
                  onClick={() => openDriver(driver)}
                  aria-label={`Ver perfil de ${driver.name}`}
                >
                  <div className="driver-card-top">
                    <span className="driver-card-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="driver-card-number">
                      {String(driver.number).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="driver-card-image">
                    <div className="driver-card-image-bg" />

                    {getLocalDriverPhoto(driver.name) || driver.headshotUrl ? (
                      <img
                        src={
                          getLocalDriverPhoto(driver.name) || driver.headshotUrl
                        }
                        alt={driver.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    ) : (
                      <span className="driver-card-placeholder">
                        {driver.driverId}
                      </span>
                    )}

                    <span className="driver-card-code">{driver.driverId}</span>
                  </div>

                  <div className="driver-card-info">
                    <span className="driver-card-team">
                      <span />
                      {driver.teamName}
                    </span>

                    <h3>{driver.name}</h3>

                    <div className="driver-card-stats">
                      <div>
                        <span>POSIÇÃO</span>
                        <strong>
                          {driver.position > 0 ? `P${driver.position}` : "—"}
                        </strong>
                      </div>

                      <div>
                        <span>PONTOS</span>
                        <strong>{driver.points}</strong>
                      </div>

                      <div className="driver-card-arrow">
                        <ArrowUpRight size={19} />
                      </div>
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>

          {filteredDrivers.length === 0 && (
            <div className="drivers-empty">
              <Search size={28} />
              <h3>Nenhum piloto encontrado.</h3>
              <p>Tente outro nome, código ou equipe.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedTeam("Todas");
                }}
              >
                LIMPAR FILTROS
              </button>
            </div>
          )}
        </section>

        <footer className="drivers-footer">
          <div className="drivers-brand">
            F1 <span>HUB</span>
          </div>

          <p>
            <Flag size={14} />
            THE GRID / SEASON 2026
          </p>

          <span>BUILT FOR RACE FANS.</span>
        </footer>
      </div>
    </main>
  );
}

export default Drivers;
