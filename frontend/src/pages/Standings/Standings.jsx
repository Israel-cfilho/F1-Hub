import { useEffect, useState } from "react";
import { Search, Trophy } from "lucide-react";
import api from "../../services/api";
import "./Standings.css";

function Standings() {
  // =========================================
  // ESTADOS
  // =========================================

  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [driverStats, setDriverStats] = useState([]);
  const [driverPhotos, setDriverPhotos] = useState([]);

  const [activeTab, setActiveTab] = useState("drivers");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================
  // BUSCAR CLASSIFICAÇÃO
  // =========================================

  useEffect(() => {
    async function loadStandings() {
      try {
        setLoading(true);
        setError(null);

        const [driversResponse, constructorsResponse, statsResponse] =
          await Promise.all([
            api.get("/f1/standings/drivers"),
            api.get("/f1/standings/constructors"),
            api.get("/f1/standings/drivers/stats"),
          ]);

        setDrivers(driversResponse.data || []);
        setConstructors(constructorsResponse.data || []);
        setDriverStats(statsResponse.data || []);
      } catch (err) {
        console.error("Erro ao carregar classificação:", err);
        setError("Não foi possível carregar a classificação.");
      } finally {
        setLoading(false);
      }
    }

    loadStandings();
  }, []);

  // =========================================
  // BUSCAR FOTOS DOS PILOTOS
  // =========================================

  useEffect(() => {
    api
      .get("/f1/drivers/photos")
      .then((response) => {
        setDriverPhotos(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.error("Erro ao carregar fotos dos pilotos:", err);
      });
  }, []);

  const getDriverPhoto = (driver) => {
    if (!driver || !driverPhotos.length) {
      return null;
    }

    const code = (driver.code || driver.driverId || "").toUpperCase();

    const photo = driverPhotos.find((item) => {
    const acronym = (item.driverId || item.name_acronym || "").toUpperCase();

      return acronym === code;
    });

    return photo?.headshotUrl || photo?.headshot_url || null;
  };

  // =========================================
  // CLASSIFICAÇÃO ATUAL
  // =========================================

  const currentStandings = activeTab === "drivers" ? drivers : constructors;

  // =========================================
  // ESTATÍSTICAS DO PILOTO
  // =========================================

  const getDriverStats = (driverId) => {
    return (
      driverStats.find((stat) => stat.driverId === driverId) || {
        driverId,
        wins: 0,
        podiums: 0,
      }
    );
  };

  // =========================================
  // FILTRO
  // =========================================

  const filteredStandings = currentStandings.filter((item) => {
    if (!search.trim()) {
      return true;
    }

    const term = search.toLowerCase().trim();

    if (activeTab === "drivers") {
      const driver = item.Driver || item.driver;

      const constructor = item.Constructors?.[0] || item.constructors?.[0];

      const driverName =
        `${driver?.givenName || ""} ${driver?.familyName || ""}`.toLowerCase();

      const constructorName = constructor?.name?.toLowerCase() || "";

      const code = driver?.code?.toLowerCase() || "";

      return (
        driverName.includes(term) ||
        constructorName.includes(term) ||
        code.includes(term)
      );
    }

    const constructor = item.constructor;

    return constructor?.name?.toLowerCase().includes(term) || false;
  });

  // =========================================
  // PONTOS DO LÍDER
  // =========================================

  const leaderPoints = Number(currentStandings[0]?.points || 0);

  // =========================================
  // TOP 3
  // =========================================

  const topThree = currentStandings.slice(0, 3);

  // =========================================
  // CORES DAS EQUIPES
  // =========================================

  const getTeamClass = (constructorName) => {
    const team = constructorName?.toLowerCase().trim();

    if (!team) return "team-default";
    if (team.includes("red bull")) return "team-red-bull";
    if (team.includes("mclaren")) return "team-mclaren";
    if (team.includes("ferrari")) return "team-ferrari";
    if (team.includes("mercedes")) return "team-mercedes";
    if (team.includes("aston martin")) return "team-aston-martin";
    if (team.includes("alpine")) return "team-alpine";
    if (team.includes("williams")) return "team-williams";

    if (team.includes("racing bulls") || team === "rb") {
      return "team-racing-bulls";
    }

    if (team.includes("sauber") || team.includes("audi")) {
      return "team-sauber";
    }

    if (team.includes("haas")) return "team-haas";
    if (team.includes("cadillac")) return "team-cadillac";

    return "team-default";
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="standings-page">
        <div className="standings-state">
          <div className="standings-loader" />
          <span>CARREGANDO CLASSIFICAÇÃO...</span>
        </div>
      </main>
    );
  }

  // =========================================
  // ERRO
  // =========================================

  if (error) {
    return (
      <main className="standings-page">
        <div className="standings-state">
          <span>{error}</span>

          <button onClick={() => window.location.reload()}>
            TENTAR NOVAMENTE
          </button>
        </div>
      </main>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="standings-page">
      {/* CABEÇALHO */}

      <section className="standings-header">
        <div className="standings-header-top">
          <div>
            <span className="standings-eyebrow">
              FIA FORMULA 1 WORLD CHAMPIONSHIP · SEASON 2026
            </span>

            <h1>CLASSIFICAÇÃO OFICIAL DO CAMPEONATO</h1>

            <strong>2026</strong>

            <p>
              Pontuação oficial da temporada, posição dos pilotos e equipes e
              evolução do campeonato.
            </p>
          </div>

          {/* PONTOS DO LÍDER */}

          <div className="standings-summary">
            <div className="standings-summary-icon">
              <Trophy size={18} />
            </div>

            <div>
              <span>PONTOS DO LÍDER</span>
              <strong>{leaderPoints}</strong>
              <small>PONTOS</small>
            </div>
          </div>
        </div>

        {/* TOP 3 */}

        <section className="standings-featured">
          {topThree.map((item, index) => {
            const position = Number(item.position || index + 1);
            const points = Number(item.points || 0);

            const driver = item.Driver || item.driver;

            const constructor =
              item.Constructors?.[0] || item.constructors?.[0];

            const team =
              activeTab === "drivers" ? constructor : item.constructor;

            const stats =
              activeTab === "drivers" && driver
                ? getDriverStats(driver.driverId)
                : null;

            const photoUrl =
              activeTab === "drivers" ? getDriverPhoto(driver) : null;

            const percentage =
              leaderPoints > 0 ? (points / leaderPoints) * 100 : 0;

            const gap = leaderPoints - points;

            return (
              <article
                className={`
                  standings-feature-card
                  position-${position}
                  ${getTeamClass(team?.name)}
                `}
                key={
                  activeTab === "drivers"
                    ? driver?.driverId || index
                    : team?.constructorId || index
                }
              >
                {/* POSIÇÃO */}

                <div className="featured-top">
                  <strong>{String(position).padStart(2, "0")}</strong>

                  <span>
                    {position === 1
                      ? "P1 · LÍDER DO CAMPEONATO"
                      : position === 2
                        ? "P2 · TÍTULO EM ABERTO"
                        : "P3 · CANDIDATO AO TÍTULO"}
                  </span>
                </div>

                {/* NÚMERO DO PILOTO */}

                {activeTab === "drivers" && (
                  <span className="featured-number">
                    #{driver?.permanentNumber || "--"}
                  </span>
                )}

                {/* PILOTO OU EQUIPE */}

                <div className="featured-content">
                  <div className="featured-avatar">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`Foto de ${driver?.givenName || ""} ${driver?.familyName || ""}`.trim()}
                        className="driver-photo featured-driver-photo"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="featured-avatar-placeholder">
                        {driver?.code ||
                          team?.name?.substring(0, 3).toUpperCase() ||
                          "F1"}
                      </div>
                    )}
                  </div>

                  <div className="featured-driver">
                    <strong>
                      {activeTab === "drivers"
                        ? `${driver?.givenName || ""} ${driver?.familyName || ""}`.trim()
                        : team?.name || "—"}
                    </strong>

                    <span>
                      {activeTab === "drivers"
                        ? `${team?.name || "—"} · ${driver?.code || ""}`
                        : team?.nationality || "—"}
                    </span>

                    <small>
                      {position === 1
                        ? "LÍDER ABSOLUTO"
                        : `-${gap} PTS PARA O LÍDER`}
                    </small>
                  </div>
                </div>

                {/* PONTOS */}

                <div className="featured-points">
                  <span>PONTUAÇÃO ATUAL</span>

                  <div>
                    <strong>{points}</strong>
                    <small>PTS</small>
                  </div>
                </div>

                {/* BARRA DE PONTOS */}

                <div className="featured-progress">
                  <span
                    style={{
                      width: `${percentage}%`,
                      background: "var(--team-color, var(--color-primary))",
                    }}
                  />
                </div>

                {/* ESTATÍSTICAS */}

                <div className="featured-stats">
                  <div>
                    <strong>{stats ? stats.wins : item.wins || 0}</strong>
                    <span>WINS</span>
                  </div>

                  <div>
                    <strong>{stats ? stats.podiums : "—"}</strong>
                    <span>PODIUMS</span>
                  </div>

                  <div>
                    <strong>—</strong>
                    <span>CHANCE</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* CONTROLES */}

        <div className="standings-controls">
          <div className="standings-tabs">
            <button
              type="button"
              className={activeTab === "drivers" ? "active" : ""}
              onClick={() => setActiveTab("drivers")}
            >
              CAMPEONATO DE PILOTOS
            </button>

            <button
              type="button"
              className={activeTab === "constructors" ? "active" : ""}
              onClick={() => setActiveTab("constructors")}
            >
              MUNDIAL DE CONSTRUTORES
            </button>
          </div>

          {/* PESQUISA */}

          <div className="standings-search">
            <Search size={13} />

            <input
              type="text"
              placeholder={
                activeTab === "drivers"
                  ? "Filtrar piloto ou escuderia..."
                  : "Filtrar equipe..."
              }
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </section>

      {/* TABELA */}

      <section className="standings-table-panel">
        <div className="standings-table-header">
          <span>POS</span>
          <span>{activeTab === "drivers" ? "PILOTO" : "EQUIPE"}</span>
          <span>EQUIPE</span>
          <span>PTS</span>
          <span>DELTA</span>
          <span>BARRA</span>
          <span>W</span>
          <span>POD</span>
        </div>

        {/* CORPO COM SCROLL */}

        <div className="standings-table-body">
          {filteredStandings.map((item, index) => {
            const position = Number(item.position || index + 1);
            const points = Number(item.points || 0);

            const percentage =
              leaderPoints > 0 ? (points / leaderPoints) * 100 : 0;

            const delta = leaderPoints - points;

            // PILOTOS

            if (activeTab === "drivers") {
              const driver = item.Driver || item.driver;

              const constructor =
                item.Constructors?.[0] || item.constructors?.[0];

              const stats = getDriverStats(driver?.driverId);
              const teamClass = getTeamClass(constructor?.name);
              const photoUrl = getDriverPhoto(driver);

              return (
                <div
                  className={`
                    standings-table-row
                    ${teamClass}
                    ${
                      position <= 3
                        ? `top-position top-position-${position}`
                        : ""
                    }
                  `}
                  key={driver?.driverId || index}
                >
                  {/* POSIÇÃO */}

                  <div className="table-position">
                    <span className="position-number">
                      {String(position).padStart(2, "0")}
                    </span>
                  </div>

                  {/* PILOTO */}

                  <div className="table-driver">
                    {photoUrl && (
                      <img
                        src={photoUrl}
                        alt={`Foto de ${driver?.givenName || ""} ${driver?.familyName || ""}`.trim()}
                        className="driver-photo table-driver-photo"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}

                    <span className="driver-team-marker" />

                    <div className="driver-info">
                      <strong>
                        {driver?.givenName} {driver?.familyName}
                      </strong>

                      <span>{driver?.code || driver?.driverId}</span>
                    </div>
                  </div>

                  {/* EQUIPE */}

                  <div className="table-team">{constructor?.name || "—"}</div>

                  {/* PONTOS */}

                  <div className="table-points">
                    <strong>{points}</strong>
                  </div>

                  {/* DELTA */}

                  <div className="table-delta">
                    {delta === 0 ? "LÍDER" : `-${delta}`}
                  </div>

                  {/* BARRA */}

                  <div className="table-bar">
                    <div>
                      <span
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* VITÓRIAS */}

                  <div className="table-wins">{stats.wins}</div>

                  {/* PÓDIOS */}

                  <div className="table-podiums">{stats.podiums}</div>
                </div>
              );
            }

            // CONSTRUTORES

            const constructor = item.constructor;
            const teamClass = getTeamClass(constructor?.name);

            return (
              <div
                className={`
                  standings-table-row
                  ${teamClass}
                  ${
                    position <= 3 ? `top-position top-position-${position}` : ""
                  }
                `}
                key={constructor?.constructorId || index}
              >
                <div className="table-position">
                  <span className="position-number">
                    {String(position).padStart(2, "0")}
                  </span>
                </div>

                <div className="table-driver">
                  <span className="driver-team-marker" />

                  <div className="driver-info">
                    <strong>{constructor?.name || "—"}</strong>
                    <span>{constructor?.nationality || "—"}</span>
                  </div>
                </div>

                <div className="table-team">{constructor?.name || "—"}</div>

                <div className="table-points">
                  <strong>{points}</strong>
                </div>

                <div className="table-delta">
                  {delta === 0 ? "LÍDER" : `-${delta}`}
                </div>

                <div className="table-bar">
                  <div>
                    <span
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="table-wins">{item.wins || 0}</div>

                <div className="table-podiums">—</div>
              </div>
            );
          })}

          {filteredStandings.length === 0 && (
            <div className="standings-empty">Nenhum resultado encontrado.</div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Standings;
