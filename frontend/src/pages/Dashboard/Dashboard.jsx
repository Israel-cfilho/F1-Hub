import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Flag,
  Gauge,
  Trophy,
  Zap,
} from "lucide-react";

import api from "../../services/api";
import { circuitImages } from "../../services/circuitImages";
import { circuitTimezones } from "../../utils/circuitTimezones";
import { formatRaceTime } from "../../utils/dateUtils";

import "./Dashboard.css";

/* =========================================
   DASHBOARD
========================================= */

function Dashboard() {
  /* =========================================
     ESTADOS
  ========================================= */

  const [races, setRaces] = useState([]);

  const [standings, setStandings] = useState([]);

  const [lastRace, setLastRace] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [standingsTab, setStandingsTab] = useState("drivers");

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /* =========================================
     BUSCAR DADOS
  ========================================= */

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [calendarResponse, standingsResponse, lastRaceResponse] =
          await Promise.all([
            api.get("/f1/calendar"),

            api.get("/f1/standings/drivers"),

            api.get("/f1/last-race"),
          ]);

        setRaces(calendarResponse.data || []);

        setStandings(standingsResponse.data || []);

        setLastRace(lastRaceResponse.data || null);
      } catch (err) {
        console.error("Erro ao carregar Dashboard:", err);

        setError("Não foi possível carregar os dados da temporada.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  /* =========================================
     INFORMAÇÕES DA TEMPORADA
  ========================================= */

  const dashboardInfo = useMemo(() => {
    const now = new Date();

    const completed = races.filter((item) => {
      const raceDate = new Date(`${item.race.date}T23:59:59`);

      return raceDate < now;
    });

    const upcoming = races.filter((item) => {
      const raceDate = new Date(`${item.race.date}T23:59:59`);

      return raceDate >= now;
    });

    const nextRace = upcoming[0] || null;

    const previousRace =
      completed.length > 0 ? completed[completed.length - 1] : null;

    return {
      total: races.length,

      completed,

      upcoming,

      nextRace,

      previousRace,

      nextRaces: upcoming.slice(0, 3),
    };
  }, [races]);

  /* =========================================
     COUNTDOWN
  ========================================= */

  useEffect(() => {
    if (!dashboardInfo.nextRace) {
      return;
    }

    const race = dashboardInfo.nextRace.race;

    function updateCountdown() {
      const target = new Date(
        `${race.date}T${(race.time || "00:00:00").replace("Z", "")}Z`,
      );

      const difference = target.getTime() - Date.now();

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setCountdown({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),

        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),

        minutes: Math.floor((difference / (1000 * 60)) % 60),

        seconds: Math.floor((difference / 1000) % 60),
      });
    }

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [dashboardInfo.nextRace]);

  /* =========================================
     VENCEDORES
  ========================================= */

  const winners = useMemo(() => {
    return dashboardInfo.completed.map((item) => item.winner).filter(Boolean);
  }, [dashboardInfo.completed]);

  /* =========================================
     VITÓRIAS DOS CONSTRUTORES
  ========================================= */

  const constructorWins = useMemo(() => {
    const map = {};

    winners.forEach((winner) => {
      const constructor = winner.Constructor || winner.constructor;

      if (!constructor) {
        return;
      }

      const id = constructor.constructorId;

      if (!map[id]) {
        map[id] = {
          constructor,

          wins: 0,
        };
      }

      map[id].wins += 1;
    });

    return Object.values(map).sort((a, b) => b.wins - a.wins);
  }, [winners]);

  /* =========================================
     FUNÇÕES AUXILIARES
  ========================================= */

  function getDriver(standing) {
    return standing?.Driver || standing?.driver || null;
  }

  function getConstructor(standing) {
    return standing?.Constructors?.[0] || standing?.constructors?.[0] || null;
  }

  /* =========================================
     CLASSIFICAÇÃO DOS CONSTRUTORES
  ========================================= */

  const constructorStandings = useMemo(() => {
    const teams = {};

    standings.forEach((standing) => {
      const constructor = getConstructor(standing);

      if (!constructor) {
        return;
      }

      const id = constructor.constructorId;

      if (!teams[id]) {
        teams[id] = {
          constructor,

          points: 0,

          wins: 0,
        };
      }

      teams[id].points += Number(standing.points || 0);

      teams[id].wins += Number(standing.wins || 0);
    });

    return Object.values(teams).sort((a, b) => b.points - a.points);
  }, [standings]);

  /* =========================================
     ABA ATUAL
  ========================================= */

  const isDriversTab = standingsTab === "drivers";

  /* =========================================
     CLASSIFICAÇÃO ATUAL
  ========================================= */

  const currentStandings = isDriversTab ? standings : constructorStandings;

  /* =========================================
     TOP 5
  ========================================= */

  const topFiveStandings = currentStandings.slice(0, 5);

  /* =========================================
     PONTOS DO LÍDER
  ========================================= */

  const championshipLeaderPoints = Number(topFiveStandings[0]?.points || 0);

  /* =========================================
     DIFERENÇA PARA O LÍDER
  ========================================= */

  function getStandingsGap(points) {
    const difference = championshipLeaderPoints - Number(points || 0);

    if (difference === 0) {
      return "LÍDER";
    }

    return `-${difference} PTS`;
  }

  /* =========================================
     LÍDER DOS PILOTOS
  ========================================= */

  const driverLeader = standings[0] || null;

  /* =========================================
     LÍDER DOS CONSTRUTORES
  ========================================= */

  const constructorLeader = constructorStandings[0] || null;

  /* =========================================
     ÚLTIMA CORRIDA
  ========================================= */

  const lastRaceResults = useMemo(() => {
    return lastRace?.Results || lastRace?.results || [];
  }, [lastRace]);

  /* =========================================
     PÓDIO
  ========================================= */

  const podium = useMemo(() => {
    return lastRaceResults

      .filter((result) => ["1", "2", "3"].includes(String(result.position)))

      .sort((a, b) => Number(a.position) - Number(b.position));
  }, [lastRaceResults]);

  /* =========================================
     VOLTA MAIS RÁPIDA
  ========================================= */

  const fastestLap = useMemo(() => {
    return (
      lastRaceResults.find((result) => {
        const lap = result.FastestLap || result.fastestLap;

        return String(lap?.rank) === "1";
      }) || null
    );
  }, [lastRaceResults]);

  /* =========================================
     PEGAR DADOS DA VOLTA
  ========================================= */

  function getFastestLap(result) {
    return result?.FastestLap || result?.fastestLap || null;
  }

  /* =========================================
     PRÓXIMA CORRIDA
  ========================================= */

  const nextRace = dashboardInfo.nextRace?.race;

  const nextCircuitId = nextRace?.Circuit?.circuitId;

  const nextCircuitImage = circuitImages[nextCircuitId];

  /* =========================================
     HORÁRIO NO BRASIL
  ========================================= */

  const nextRaceBrazilTime =
    nextRace?.date && nextRace?.time
      ? formatRaceTime(nextRace.date, nextRace.time, "America/Sao_Paulo")
      : "--";

  /* =========================================
     HORÁRIO LOCAL
  ========================================= */

  const nextRaceLocalTime =
    nextRace?.date && nextRace?.time && circuitTimezones[nextCircuitId]
      ? formatRaceTime(
          nextRace.date,
          nextRace.time,
          circuitTimezones[nextCircuitId],
        )
      : "--";

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="dashboard">
        <div className="dashboard-state">
          <div className="dashboard-loader" />

          <span>SINCRONIZANDO DADOS DA TEMPORADA...</span>
        </div>
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <main className="dashboard">
        <div
          className="
            dashboard-state
            dashboard-error
          "
        >
          <span>{error}</span>

          <button onClick={() => window.location.reload()}>
            TENTAR NOVAMENTE
          </button>
        </div>
      </main>
    );
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="dashboard">
      {/* =====================================
          HERO
      ===================================== */}

      <section className="dashboard-hero">
        <div className="dashboard-hero-overlay" />

        <div className="dashboard-hero-content">
          {/* HERO ESQUERDA */}

          <div className="dashboard-hero-left">
            <span className="dashboard-eyebrow">
              FIA FORMULA 1 WORLD CHAMPIONSHIP
            </span>

            <h1>
              THE APEX OF
              <span>MOTORSPORT</span>
            </h1>

            <p className="dashboard-hero-description">
              Acompanhe em tempo real a temporada, pilotos, equipes, resultados,
              estatísticas e dados de cada Grande Prêmio.
            </p>

            <div className="dashboard-system-status">
              <div>
                <span className="status-dot" />

                <strong>PIT WALL SYNCED</strong>

                <small>DADOS DA API</small>
              </div>

              <div>
                <Gauge size={14} />

                <strong>FIA DATA</strong>

                <small>JOLPICA F1 API</small>
              </div>
            </div>
          </div>

          {/* PRÓXIMA CORRIDA */}

          {nextRace && (
            <div className="dashboard-next-race">
              <div className="dashboard-next-header">
                <span>PRÓXIMA CORRIDA</span>

                <small>R{String(nextRace.round).padStart(2, "0")}</small>
              </div>

              <div className="dashboard-next-body">
                <span className="dashboard-next-country">
                  {nextRace.Circuit?.Location?.country}
                </span>

                <h2>{nextRace.raceName}</h2>

                <p>{nextRace.Circuit?.circuitName}</p>

                <div className="dashboard-next-meta">
                  <div>
                    <span>DATA</span>

                    <strong>{formatDate(nextRace.date)}</strong>
                  </div>

                  <div>
                    <span>BRASIL</span>

                    <strong>{nextRaceBrazilTime}</strong>
                  </div>
                </div>

                <div className="dashboard-countdown">
                  <span>CONTAGEM REGRESSIVA</span>

                  <div>
                    <CountdownItem value={countdown.days} label="DIAS" />

                    <CountdownItem value={countdown.hours} label="H" />

                    <CountdownItem value={countdown.minutes} label="MIN" />

                    <CountdownItem
                      value={countdown.seconds}
                      label="SEG"
                      highlight
                    />
                  </div>
                </div>

                <Link
                  to="/calendar"
                  className="
                    dashboard-next-button
                  "
                >
                  DETALHES DO GP
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================
          STATS
      ===================================== */}

      <section className="dashboard-stats">
        <DashboardStat
          icon={<CalendarDays size={13} />}
          label="TEMPORADA"
          value={races[0]?.race?.season || "----"}
          detail={`${dashboardInfo.completed.length} DE ${dashboardInfo.total} CORRIDAS`}
        />

        <DashboardStat
          icon={<Trophy size={13} />}
          label="LÍDER PILOTOS"
          value={
            driverLeader
              ? `${getDriver(driverLeader)?.givenName || ""} ${
                  getDriver(driverLeader)?.familyName || ""
                }`
              : "AGUARDANDO"
          }
          detail={
            driverLeader
              ? `${driverLeader.points} PTS`
              : "DADOS EM SINCRONIZAÇÃO"
          }
        />

        <DashboardStat
          icon={<Flag size={13} />}
          label="LÍDER CONSTRUTORES"
          value={constructorLeader?.constructor?.name || "AGUARDANDO"}
          detail={
            constructorLeader
              ? `${constructorLeader.points} PTS`
              : "DADOS EM SINCRONIZAÇÃO"
          }
        />

        <DashboardStat
          icon={<Zap size={13} />}
          label="VITÓRIAS"
          value={winners.length}
          detail="
            GRAND PRIX CONCLUÍDOS
          "
        />

        <DashboardStat
          icon={<Gauge size={13} />}
          label="ETAPAS RESTANTES"
          value={dashboardInfo.upcoming.length}
          detail="
            NO CALENDÁRIO
          "
        />

        <DashboardStat
          icon={<Flag size={13} />}
          label="PRÓXIMO ROUND"
          value={
            nextRace ? `R${String(nextRace.round).padStart(2, "0")}` : "--"
          }
          detail={nextRace?.Circuit?.Location?.country || "TEMPORADA"}
        />
      </section>

      {/* =====================================
          CAMPEONATO + ÚLTIMA CORRIDA
      ===================================== */}

      <section className="dashboard-main-grid">
        {/* =====================================
            TOP 5
        ===================================== */}

        <section
          className="
            dashboard-panel
            standings-panel
          "
        >
          <div className="dashboard-panel-header">
            <div>
              <span>
                CAMPEONATO MUNDIAL{" "}
                {isDriversTab ? "DE PILOTOS" : "DE CONSTRUTORES"}
              </span>

              <h2>TOP 5</h2>
            </div>

            {/* ABAS */}

            <div className="standings-tabs">
              <button
                type="button"
                className={standingsTab === "drivers" ? "active" : ""}
                onClick={() => setStandingsTab("drivers")}
              >
                PILOTOS
              </button>

              <button
                type="button"
                className={standingsTab === "constructors" ? "active" : ""}
                onClick={() => setStandingsTab("constructors")}
              >
                CONSTRUTORES
              </button>
            </div>
          </div>

          {/* LISTA */}

          <div className="dashboard-standing-list">
            {topFiveStandings.map((standing, index) => {
              const points = Number(standing.points || 0);

              const percentage =
                championshipLeaderPoints > 0
                  ? (points / championshipLeaderPoints) * 100
                  : 0;

              /* =====================================
                   PILOTOS
                ===================================== */

              if (isDriversTab) {
                const driver = getDriver(standing);

                const constructor = getConstructor(standing);

                return (
                  <div className="standing-row" key={driver?.driverId || index}>
                    <div className="standing-position">
                      {standing.position || index + 1}
                    </div>

                    <div className="standing-driver">
                      <strong>
                        {driver?.givenName} {driver?.familyName}
                      </strong>

                      <span>
                        {constructor?.name || "—"}

                        {" · "}

                        {driver?.code || driver?.driverId || "—"}
                      </span>
                    </div>

                    <div className="standing-points">
                      <div className="points-bar">
                        <div
                          className="
                              points-bar-fill
                            "
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <strong>{points}</strong>
                    </div>

                    <div
                      className={`standing-delta ${
                        index === 0 ? "leader" : ""
                      }`}
                    >
                      {getStandingsGap(points)}
                    </div>
                  </div>
                );
              }

              /* =====================================
                   CONSTRUTORES
                ===================================== */

              const constructor = standing.constructor;

              return (
                <div
                  className="standing-row"
                  key={constructor?.constructorId || index}
                >
                  <div className="standing-position">{index + 1}</div>

                  <div className="standing-driver">
                    <strong>{constructor?.name || "—"}</strong>

                    <span>{constructor?.nationality || "EQUIPE"}</span>
                  </div>

                  <div className="standing-points">
                    <div className="points-bar">
                      <div
                        className="
                            points-bar-fill
                          "
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <strong>{points}</strong>
                  </div>

                  <div
                    className={`standing-delta ${index === 0 ? "leader" : ""}`}
                  >
                    {getStandingsGap(points)}
                  </div>
                </div>
              );
            })}

            {topFiveStandings.length === 0 && (
              <div className="dashboard-empty">
                Nenhum dado de classificação disponível.
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="panel-footer">
            <span>
              MUNDIAL DE {isDriversTab ? "PILOTOS" : "CONSTRUTORES"} OFICIAL FIA
            </span>

            <Link to="/standings">
              VER CLASSIFICAÇÃO COMPLETA
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* =====================================
            ÚLTIMA CORRIDA
        ===================================== */}

        <section
          className="
            dashboard-panel
            last-race-panel
          "
        >
          <div className="dashboard-panel-header">
            <div>
              <span>RESULTADOS R{lastRace?.round || "--"}</span>

              <h2>{lastRace?.raceName || "ÚLTIMA CORRIDA"}</h2>
            </div>

            <span className="race-date">
              {lastRace?.date ? formatDate(lastRace.date) : "--"}
            </span>
          </div>

          {/* PÓDIO */}

          {podium.length > 0 ? (
            <>
              <div className="podium">
                {podium.map((result) => {
                  const driver = result.Driver || result.driver;

                  const constructor = result.Constructor || result.constructor;

                  return (
                    <div
                      className={`podium-driver position-${result.position}`}
                      key={driver?.driverId || result.position}
                    >
                      <span className="podium-position">{result.position}</span>

                      <div className="podium-driver-info">
                        <strong>
                          {driver?.givenName || ""} {driver?.familyName || ""}
                        </strong>

                        <span>{constructor?.name || "—"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* VOLTA MAIS RÁPIDA */}

              {fastestLap && (
                <div className="fastest-lap">
                  <div>
                    <span>VOLTA MAIS RÁPIDA</span>

                    <strong>
                      {(fastestLap.Driver || fastestLap.driver)?.givenName ||
                        ""}{" "}
                      {(fastestLap.Driver || fastestLap.driver)?.familyName ||
                        "--"}
                    </strong>
                  </div>

                  <div className="fastest-lap-time">
                    {getFastestLap(fastestLap)?.Time?.time ||
                      getFastestLap(fastestLap)?.time?.time ||
                      "--"}
                  </div>
                </div>
              )}

              {/* INFORMAÇÕES */}

              <div className="race-info-grid">
                <div>
                  <span>RESULTADOS</span>

                  <strong>{lastRaceResults.length} PILOTOS</strong>
                </div>

                <div>
                  <span>VOLTA RÁPIDA</span>

                  <strong>{getFastestLap(fastestLap)?.lap || "--"}</strong>
                </div>

                <div>
                  <span>VELOCIDADE MÉDIA</span>

                  <strong>
                    {getFastestLap(fastestLap)?.AverageSpeed?.speed ||
                    getFastestLap(fastestLap)?.averageSpeed?.speed
                      ? `${
                          getFastestLap(fastestLap)?.AverageSpeed?.speed ||
                          getFastestLap(fastestLap)?.averageSpeed?.speed
                        } ${
                          getFastestLap(fastestLap)?.AverageSpeed?.units ||
                          getFastestLap(fastestLap)?.averageSpeed?.units ||
                          ""
                        }`
                      : "--"}
                  </strong>
                </div>
              </div>
            </>
          ) : (
            <div className="dashboard-empty">
              Ainda não há resultado disponível para exibição.
            </div>
          )}
        </section>
      </section>

      {/* =====================================
          PRÓXIMAS CORRIDAS
      ===================================== */}

      <section className="dashboard-upcoming">
        <div className="dashboard-section-header">
          <div>
            <span>CALENDÁRIO A SEGUIR</span>

            <h2>PRÓXIMAS ETAPAS</h2>
          </div>

          <Link to="/calendar">
            VER CALENDÁRIO COMPLETO
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="dashboard-races-grid">
          {dashboardInfo.nextRaces.map((item) => {
            const race = item.race;

            const image = circuitImages[race.Circuit?.circuitId];

            return (
              <Link
                to="/calendar"
                className="
                    dashboard-race-card
                  "
                key={race.round}
              >
                <div className="dashboard-race-top">
                  <span>ROUND {String(race.round).padStart(2, "0")}</span>

                  <small>{race.Circuit?.Location?.country}</small>
                </div>

                <div className="dashboard-race-content">
                  <div>
                    <span>{formatDate(race.date)}</span>

                    <h3>{race.raceName}</h3>

                    <p>{race.Circuit?.circuitName}</p>
                  </div>

                  <div className="dashboard-race-track">
                    {image ? (
                      <img
                        src={image}
                        alt={`Traçado de ${race.Circuit?.circuitName}`}
                      />
                    ) : (
                      <span>TRAÇADO</span>
                    )}
                  </div>
                </div>

                <div className="dashboard-race-footer">
                  <span>{race.Circuit?.Location?.locality}</span>

                  <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =====================================
          RODAPÉ INFORMATIVO
      ===================================== */}

      <section className="dashboard-info-bar">
        <div>
          <span className="status-dot" />

          <strong>F1 HUB SYSTEM ONLINE</strong>

          <small>DADOS SINCRONIZADOS COM JOLPICA</small>
        </div>

        <div>
          <span>TEMPORADA</span>

          <strong>{races[0]?.race?.season || "----"}</strong>
        </div>

        <div>
          <span>ETAPAS</span>

          <strong>{dashboardInfo.total}</strong>
        </div>

        <div>
          <span>CONCLUÍDAS</span>

          <strong>{dashboardInfo.completed.length}</strong>
        </div>
      </section>
    </main>
  );
}

/* =========================================
   COMPONENTE — COUNTDOWN
========================================= */

function CountdownItem({ value, label, highlight = false }) {
  return (
    <div className={`dashboard-countdown-item ${highlight ? "highlight" : ""}`}>
      <strong>{String(value).padStart(2, "0")}</strong>

      <span>{label}</span>
    </div>
  );
}

/* =========================================
   COMPONENTE — STAT
========================================= */

function DashboardStat({ icon, label, value, detail }) {
  return (
    <div className="dashboard-stat">
      <div className="dashboard-stat-top">
        <span>{label}</span>

        <i>{icon}</i>
      </div>

      <strong title={value}>{value}</strong>

      <small>{detail}</small>
    </div>
  );
}

/* =========================================
   FORMATAR DATA
========================================= */

function formatDate(date) {
  if (!date) {
    return "--";
  }

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

/* =========================================
   EXPORT
========================================= */

export default Dashboard;
