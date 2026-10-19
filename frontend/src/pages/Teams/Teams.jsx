import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpRight, Trophy, Users, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import {
  TEAM_DATA,
  TEAM_STYLES,
  DEFAULT_STYLE,
  TEAM_ALIASES,
} from "./TeamsData";

import "./Teams.css";

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getTeamStyle(team) {
  const id = normalizeText(
    team.constructorId ||
      team.teamId ||
      team.id ||
      team.name ||
      team.teamName ||
      team.constructorName,
  );

  const key = TEAM_ALIASES[id] || id;

  return (
    TEAM_STYLES[key] ||
    Object.entries(TEAM_STYLES).find(([name]) =>
      id.includes(normalizeText(name)),
    )?.[1] ||
    DEFAULT_STYLE
  );
}

function getTeamName(team) {
  return (
    team.constructorName ||
    team.teamName ||
    team.name ||
    team.constructor?.name ||
    team.constructor?.constructorName ||
    "Equipe"
  );
}

function getTeamId(team) {
  return (
    team.constructorId ||
    team.teamId ||
    team.id ||
    team.constructor?.constructorId ||
    normalizeText(getTeamName(team))
  );
}

function getPoints(team) {
  const value = Number(team.points ?? team.totalPoints ?? team.score ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function getPosition(team, index) {
  const value = Number(team.position ?? team.rank ?? index + 1);

  return Number.isFinite(value) ? value : index + 1;
}

function getWins(team) {
  const value = Number(team.wins ?? team.raceWins ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function getTeamInfo(team) {
  const id = normalizeText(
    team.constructorId || team.teamId || team.id || getTeamName(team),
  );

  const name = normalizeText(getTeamName(team));

  const aliases = {
    redbull: "red-bull",
    redbullracing: "red-bull",
    rb: "racing-bulls",
    racingbulls: "racing-bulls",
    astonmartin: "aston-martin",
    astonmartinaramco: "aston-martin",
    mercedesamgf1: "mercedes",
    scuderiaferrari: "ferrari",
    mclarenf1team: "mclaren",
    williamsracing: "williams",
    haasf1team: "haas",
    kicksauber: "audi",
  };

  const normalizedId = aliases[id] || id;

  return (
    TEAM_DATA.find((item) => {
      const itemId = normalizeText(item.id);
      const itemName = normalizeText(item.name);

      return (
        itemId === normalizedId ||
        itemName === name ||
        itemId === name ||
        name.includes(itemName) ||
        itemName.includes(name)
      );
    }) || null
  );
}

function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function loadTeams() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/f1/standings/constructors");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data?.constructors ||
          data?.standings ||
          data?.results ||
          data?.data ||
          [];

      if (!Array.isArray(list)) {
        throw new Error("Formato de classificação não reconhecido.");
      }

      setTeams(list);
    } catch (err) {
      console.error("Erro ao carregar equipes:", err);

      setError(
        err.response?.status === 429
          ? "A API está recebendo muitas requisições. Aguarde um pouco e tente novamente."
          : "Não foi possível carregar a classificação. Verifique se o backend está ativo.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  const displayTeams = useMemo(() => {
    const standings = new Map(
      teams.map((team, index) => {
        const info = getTeamInfo(team);
        const id = info?.id || normalizeText(getTeamName(team));

        return [
          id,
          {
            ...team,
            _position: getPosition(team, index),
          },
        ];
      }),
    );

    return TEAM_DATA.map((teamInfo, index) => {
      const id = normalizeText(teamInfo.id);

      const matchingEntry = [...standings.entries()].find(
        ([standingId, standing]) => {
          const standingInfo = getTeamInfo(standing);

          return standingId === id || normalizeText(standingInfo?.id) === id;
        },
      );

      const standing = matchingEntry?.[1];

      return {
        ...teamInfo,
        ...(standing || {}),
        _teamInfo: teamInfo,
        _position: standing ? standing._position : index + 1,
        _points: standing ? getPoints(standing) : 0,
        _wins: standing ? getWins(standing) : 0,
      };
    });
  }, [teams]);

  const filteredTeams = useMemo(() => {
    return displayTeams
      .filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase().trim()),
      )
      .sort((a, b) => a._position - b._position);
  }, [displayTeams, search]);

  const totalPoints = displayTeams.reduce(
    (total, team) => total + team._points,
    0,
  );

  const leader = [...displayTeams].sort((a, b) => a._position - b._position)[0];

  return (
    <main className="teams-page">
      <section className="teams-hero">
        <div className="teams-hero-top">
          <span className="teams-eyebrow">
            F1 HUB <span /> CONSTRUTORES
          </span>

          <span className="teams-season">TEMPORADA 2026</span>
        </div>

        <div className="teams-title-wrap">
          <p className="teams-overline">THE GRID. THE MACHINES. THE TEAMS.</p>

          <h1>
            THE <span>TEAMS.</span>
          </h1>

          <p className="teams-intro">
            Engenharia, estratégia e velocidade. Conheça as equipes que disputam
            o campeonato mundial de Fórmula 1.
          </p>
        </div>

        <div className="teams-hero-bottom">
          <span>01 / CONSTRUTORES</span>
          <span>CAMPEONATO MUNDIAL DE F1</span>
        </div>
      </section>

      <section className="teams-content">
        <div className="teams-stats">
          <article className="teams-stat">
            <span className="teams-stat-label">
              <Users size={15} /> EQUIPES
            </span>

            <strong>{TEAM_DATA.length}</strong>

            <span className="teams-stat-caption">NO GRID</span>
          </article>

          <article className="teams-stat">
            <span className="teams-stat-label">
              <Trophy size={15} /> LÍDER ATUAL
            </span>

            <strong className="teams-leader-name">
              {loading ? "—" : teams.length ? getTeamName(leader || {}) : "—"}
            </strong>

            <span className="teams-stat-caption">
              {loading
                ? "CARREGANDO"
                : teams.length
                  ? `${leader?._points ?? 0} PTS`
                  : "CLASSIFICAÇÃO INDISPONÍVEL"}
            </span>
          </article>

          <article className="teams-stat">
            <span className="teams-stat-label">PONTOS SOMADOS</span>

            <strong>{loading ? "—" : totalPoints}</strong>

            <span className="teams-stat-caption">CONSTRUTORES</span>
          </article>
        </div>

        <div className="teams-list-heading">
          <div>
            <span className="teams-section-kicker">A TEMPORADA 2026</span>

            <h2>O GRID</h2>
          </div>

          <label className="teams-search">
            <Search size={17} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar equipe..."
              aria-label="Buscar equipe"
            />
          </label>
        </div>

        {loading && (
          <div className="teams-message">
            <span className="teams-loader" />
            <p>Carregando classificação...</p>
          </div>
        )}

        {!loading && error && (
          <div className="teams-message teams-error">
            <p>{error}</p>

            <button type="button" onClick={loadTeams}>
              <RefreshCw size={16} /> Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && filteredTeams.length === 0 && (
          <div className="teams-message">
            <p>Nenhuma equipe encontrada para essa busca.</p>
          </div>
        )}

        {!loading && !error && filteredTeams.length > 0 && (
          <div className="teams-grid">
            {filteredTeams.map((team, index) => {
              const info = team._teamInfo;
              const style = getTeamStyle(team);
              const position = team._position ?? index + 1;

              return (
                <article
                  className="team-card"
                  key={info.id}
                  onClick={() => navigate(`/teams/${info.id}`)}
                  style={{
                    "--team-color": info.color || style.color,
                    "--team-dark": info.dark || "#17191D",
                    cursor: "pointer",
                  }}
                >
                  <div className="team-card-top">
                    <span className="team-position">
                      {String(position).padStart(2, "0")}
                    </span>

                    <div className="team-monogram">
                      <img
                        src={info.logo}
                        alt={`Logo da equipe ${info.name}`}
                      />
                    </div>
                  </div>

                  <div className="team-card-main">
                    <div className="team-color-line" />

                    <h3>{info.name}</h3>

                    <p className="team-card-subtitle">
                      FIA FORMULA ONE WORLD CHAMPIONSHIP
                    </p>
                  </div>

                  {/* <div className="team-card-metrics">
                    <div>
                      <span>PONTOS</span>
                      <strong>{team._points}</strong>
                    </div>

                    <div>
                      <span>VITÓRIAS</span>
                      <strong>{team._wins}</strong>
                    </div>
                  </div> */}

                  <div className="team-card-drivers">
                    <span className="team-drivers-label">PILOTOS</span>

                    <div className="team-drivers-list">
                      {info.drivers.map((driver) => (
                        <span key={driver}>{driver}</span>
                      ))}
                    </div>
                  </div>

                  <div className="team-card-car">
                    <img
                      src={info.car}
                      alt={`Carro da equipe ${info.name}`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="team-card-footer">
                    <span>F1 HUB / 2026</span>
                    <ArrowUpRight size={19} />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="teams-footer-note">
          <span className="teams-footer-dot" />

          <p>
            CLASSIFICAÇÃO SUJEITA A ATUALIZAÇÕES · PONTOS E POSIÇÕES FORNECIDOS
            PELA API
          </p>
        </div>
      </section>
    </main>
  );
}

export default Teams;
