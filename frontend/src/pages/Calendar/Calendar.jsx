import { useEffect, useMemo, useState } from "react";

import api from "../../services/api";
import { circuitImages } from "../../services/circuitImages";
import "./Calendar.css";

import { Trophy } from "lucide-react";

import { circuitTimezones } from "../../utils/circuitTimezones";
import { formatRaceTime } from "../../utils/dateUtils";

function Calendar() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  /*
   * =================================
   * BUSCAR CALENDÁRIO
   * =================================
   */

  useEffect(() => {
    api
      .get("/f1/calendar")
      .then((response) => {
        setRaces(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar calendário:", error);
        setError("Não foi possível carregar o calendário.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /*
   * =================================
   * INFORMAÇÕES DO CALENDÁRIO
   * =================================
   */

  const calendarInfo = useMemo(() => {
    const today = new Date();

    const completed = races.filter((item) => {
      const race = item.race;

      return new Date(`${race.date}T23:59:59`) < today;
    });

    const upcoming = races.filter((item) => {
      const race = item.race;

      return new Date(`${race.date}T23:59:59`) >= today;
    });

    const nextRace = upcoming[0] || null;

    return {
      total: races.length,
      completed: completed.length,
      remaining: upcoming.length,
      nextRace,
    };
  }, [races]);

  /*
   * =================================
   * COUNTDOWN
   * =================================
   */

  useEffect(() => {
    if (!calendarInfo.nextRace) return;

    const race = calendarInfo.nextRace.race;

    const updateCountdown = () => {
      const target = new Date(
        `${race.date}T${(race.time || "00:00:00").replace("Z", "")}Z`,
      );

      const now = new Date();

      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24),
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24,
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60,
      );

      const seconds = Math.floor(
        (difference / 1000) % 60,
      );

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [calendarInfo.nextRace]);

  /*
   * =================================
   * FILTROS
   * =================================
   */

  const filteredRaces = useMemo(() => {
    return races.filter((item) => {
      const race = item.race;

      const raceDate = new Date(
        `${race.date}T23:59:59`,
      );

      const isCompleted = raceDate < new Date();

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "completed"
            ? isCompleted
            : !isCompleted;

      const searchText = search.toLowerCase();

      const matchesSearch =
        race.raceName
          ?.toLowerCase()
          .includes(searchText) ||
        race.Circuit?.circuitName
          ?.toLowerCase()
          .includes(searchText) ||
        race.Circuit?.Location?.country
          ?.toLowerCase()
          .includes(searchText) ||
        race.Circuit?.Location?.locality
          ?.toLowerCase()
          .includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [races, filter, search]);

  /*
   * =================================
   * LOADING
   * =================================
   */

  if (loading) {
    return (
      <main className="calendar">
        <div className="calendar-loading">
          CARREGANDO CALENDÁRIO...
        </div>
      </main>
    );
  }

  /*
   * =================================
   * ERROR
   * =================================
   */

  if (error) {
    return (
      <main className="calendar">
        <div className="calendar-error">
          {error}
        </div>
      </main>
    );
  }

  /*
   * =================================
   * PRÓXIMA CORRIDA
   * =================================
   */

  const nextRace = calendarInfo.nextRace?.race;

  /*
   * =================================
   * CRONOGRAMA
   * =================================
   */

  const schedule = [
    {
      name: "TREINO LIVRE 1",
      session: nextRace?.FirstPractice,
    },
    {
      name: "TREINO LIVRE 2",
      session: nextRace?.SecondPractice,
    },
    {
      name: "TREINO LIVRE 3",
      session: nextRace?.ThirdPractice,
    },
    {
      name: "SPRINT SHOOTOUT",
      session:
        nextRace?.SprintQualifying ||
        nextRace?.SprintShootout,
    },
    {
      name: "SPRINT",
      session: nextRace?.Sprint,
    },
    {
      name: "CLASSIFICAÇÃO",
      session: nextRace?.Qualifying,
    },
    {
      name: "GRANDE PRÊMIO",
      session: nextRace,
    },
  ].filter((item) => item.session);

  /*
   * =================================
   * FORMATAR DATA DO CRONOGRAMA
   * =================================
   */

  const formatScheduleDate = (date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
      .format(new Date(`${date}T12:00:00`))
      .replace(".", "")
      .toUpperCase();
  };

  /*
   * =================================
   * RENDER
   * =================================
   */

  return (
    <main className="calendar">

      {/* =================================
          CABEÇALHO
      ================================= */}

      <section className="calendar-heading">
        <div>
          <span className="calendar-eyebrow">
            FIA OFFICIAL CALENDAR FEED
          </span>

          <h1>
            CALENDÁRIO OFICIAL{" "}
            <span>
              {races[0]?.race?.season || "2026"}
            </span>
          </h1>

          <p>
            TEMPORADA MUNDIAL DE FÓRMULA 1 •{" "}
            {calendarInfo.total} GRAND PRIX
          </p>
        </div>
      </section>

      {/* =================================
          PROGRESSO
      ================================= */}

      <section className="calendar-progress">
        <div className="calendar-progress-top">
          <strong>
            {calendarInfo.completed} DE{" "}
            {calendarInfo.total} ETAPAS CONCLUÍDAS
          </strong>

          <span>
            {calendarInfo.total > 0
              ? Math.round(
                  (calendarInfo.completed /
                    calendarInfo.total) *
                    100,
                )
              : 0}
            % COMPLETO
          </span>

          <small>
            {calendarInfo.remaining} RESTANTES
          </small>
        </div>

        <div className="calendar-progress-bar">
          <span
            style={{
              width: `${
                calendarInfo.total > 0
                  ? (calendarInfo.completed /
                      calendarInfo.total) *
                    100
                  : 0
              }%`,
            }}
          />
        </div>
      </section>

      {/* =================================
          FILTROS
      ================================= */}

      <section className="calendar-filters">

        <button
          className={
            filter === "all" ? "active" : ""
          }
          onClick={() => setFilter("all")}
        >
          TODAS
        </button>

        <button
          className={
            filter === "completed"
              ? "active"
              : ""
          }
          onClick={() => setFilter("completed")}
        >
          CONCLUÍDAS
        </button>

        <button
          className={
            filter === "upcoming"
              ? "active"
              : ""
          }
          onClick={() => setFilter("upcoming")}
        >
          PRÓXIMAS
        </button>

        <input
          className="calendar-search"
          type="text"
          placeholder="BUSCAR GRANDE PRIX..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </section>

      {/* =================================
          PRÓXIMA CORRIDA
      ================================= */}

      {calendarInfo.nextRace && (
        <section className="next-race">

          {/* =================================
              LADO ESQUERDO
          ================================= */}

          <div className="next-race-main">

            <div className="next-race-top">

              <div>
                <span className="next-race-badge">
                  PRÓXIMA CORRIDA
                </span>

                <span className="next-race-round">
                  ROUND{" "}
                  {String(
                    calendarInfo.nextRace.race.round,
                  ).padStart(2, "0")}{" "}
                  / {calendarInfo.total}
                </span>
              </div>

              <span className="next-race-country">
                {
                  calendarInfo.nextRace.race.Circuit
                    ?.Location?.country
                }
              </span>

            </div>

            <div className="next-race-details">

              <h2>
                {calendarInfo.nextRace.race.raceName}
              </h2>

              <p className="next-race-circuit">
                {
                  calendarInfo.nextRace.race.Circuit
                    ?.circuitName
                }
              </p>

              <p className="next-race-location">
                {
                  calendarInfo.nextRace.race.Circuit
                    ?.Location?.locality
                }{" "}
                •{" "}
                {
                  calendarInfo.nextRace.race.Circuit
                    ?.Location?.country
                }
              </p>

              {/* DATA E HORÁRIOS */}

              <div className="next-race-date">

                <div>
                  <span>DATA DA CORRIDA</span>

                  <strong>
                    {formatDate(
                      calendarInfo.nextRace.race.date,
                    )}
                  </strong>
                </div>

                <div>
                  <span>HORÁRIO BRASIL</span>

                  <strong>
                    {calendarInfo.nextRace.race.time
                      ? formatRaceTime(
                          calendarInfo.nextRace.race.date,
                          calendarInfo.nextRace.race.time,
                          "America/Sao_Paulo",
                        )
                      : "--"}
                  </strong>
                </div>

                <div>
                  <span>HORÁRIO LOCAL</span>

                  <strong>
                    {calendarInfo.nextRace.race.time
                      ? formatRaceTime(
                          calendarInfo.nextRace.race.date,
                          calendarInfo.nextRace.race.time,
                          circuitTimezones[
                            calendarInfo.nextRace.race
                              .Circuit?.circuitId
                          ],
                        )
                      : "--"}
                  </strong>
                </div>

              </div>

              {/* =================================
                  COUNTDOWN
              ================================= */}

              <div className="next-race-countdown">

                <span className="countdown-label">
                  CONTAGEM REGRESSIVA PARA A CORRIDA
                </span>

                <div className="countdown-grid">

                  <div className="countdown-item">
                    <strong>
                      {String(
                        countdown.days,
                      ).padStart(2, "0")}
                    </strong>

                    <span>DIAS</span>
                  </div>

                  <div className="countdown-item">
                    <strong>
                      {String(
                        countdown.hours,
                      ).padStart(2, "0")}
                    </strong>

                    <span>HORAS</span>
                  </div>

                  <div className="countdown-item">
                    <strong>
                      {String(
                        countdown.minutes,
                      ).padStart(2, "0")}
                    </strong>

                    <span>MIN</span>
                  </div>

                  <div className="countdown-item">
                    <strong>
                      {String(
                        countdown.seconds,
                      ).padStart(2, "0")}
                    </strong>

                    <span>SEG</span>
                  </div>

                </div>
              </div>

              {/* =================================
                  BOTÕES
              ================================= */}

              {/* <div className="next-race-actions">

                <button className="next-race-primary">
                  <Trophy size={15} />

                  VER GUIA COMPLETO DO GP
                </button>

                <button className="next-race-secondary">
                  ↯ ANÁLISE TELEMETRIA PISTA
                </button>

              </div> */}

            </div>
          </div>

          {/* =================================
              LADO DIREITO
          ================================= */}

          <div className="next-race-side">

            {/* =================================
                CIRCUITO
            ================================= */}

            <div className="next-race-track">

              <div className="track-header">

                <span>
                  ● MAPA ESQUEMÁTICO • CIRCUITO
                </span>

                <small>
                  TRAÇADO
                </small>

              </div>

              {circuitImages[
                calendarInfo.nextRace.race.Circuit
                  ?.circuitId
              ] ? (

                <img
                  src={
                    circuitImages[
                      calendarInfo.nextRace.race.Circuit
                        ?.circuitId
                    ]
                  }
                  alt={`Traçado do ${
                    calendarInfo.nextRace.race.Circuit
                      ?.circuitName
                  }`}
                />

              ) : (

                <span className="track-unavailable">
                  TRAÇADO INDISPONÍVEL
                </span>

              )}

            </div>

            {/* =================================
                CRONOGRAMA
            ================================= */}

            <div className="next-race-schedule">

              <span className="schedule-title">
                CRONOGRAMA OFICIAL FIA{" "}
                <small>
                  (HORÁRIO DE BRASÍLIA)
                </small>
              </span>

              <div className="schedule-list">

                {schedule.map((item) => (

                  <div
                    className="schedule-item"
                    key={item.name}
                  >

                    <span className="schedule-date">
                      {formatScheduleDate(
                        item.session.date,
                      )}
                    </span>

                    <strong>
                      {item.name}
                    </strong>

                    <span className="schedule-time">
                      {formatRaceTime(
                        item.session.date,
                        item.session.time,
                        "America/Sao_Paulo",
                      )}
                    </span>

                  </div>

                ))}

              </div>
            </div>

          </div>

        </section>
      )}

      {/* =================================
          TODAS AS ETAPAS
      ================================= */}

      <section className="calendar-races">

        <div className="section-title">

          <div>
            <span>CALENDÁRIO</span>

            <h2>
              GRANDE PRIX — TEMPORADA{" "}
              {races[0]?.race?.season}
            </h2>
          </div>

          <small>
            {calendarInfo.total} CORRIDAS
          </small>

        </div>

        <div className="race-grid">

          {filteredRaces.map((item) => {

            const race = item.race;
            const winner = item.winner;

            const raceDate = new Date(
              `${race.date}T23:59:59`,
            );

            const isCompleted =
              raceDate < new Date();

            const isNext =
              calendarInfo.nextRace?.race?.round ===
              race.round;

            return (
              <article
                className={`race-card ${
                  isNext ? "next" : ""
                } ${
                  isCompleted
                    ? "completed"
                    : "upcoming"
                }`}
                key={race.round}
              >

                {/* HEADER */}

                <div className="race-card-header">

                  <span className="race-round">
                    ROUND{" "}
                    {String(race.round).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span
                    className={`race-status ${
                      isCompleted
                        ? "completed"
                        : isNext
                          ? "next"
                          : "upcoming"
                    }`}
                  >
                    {isCompleted
                      ? "CONCLUÍDA"
                      : isNext
                        ? "PRÓXIMA"
                        : "A SEGUIR"}
                  </span>

                </div>

                {/* PAÍS */}

                <div className="race-card-country">
                  {race.Circuit?.Location?.country}
                </div>

                {/* NOME */}

                <h3>
                  {race.raceName}
                </h3>

                <p className="race-circuit">
                  {race.Circuit?.circuitName}
                </p>

                <p className="race-location">
                  {race.Circuit?.Location?.locality}{" "}
                  •{" "}
                  {race.Circuit?.Location?.country}
                </p>

                {/* CIRCUITO */}

                <div className="circuit-layout">

                  {circuitImages[
                    race.Circuit?.circuitId
                  ] ? (

                    <img
                      src={
                        circuitImages[
                          race.Circuit.circuitId
                        ]
                      }
                      alt={`Traçado do ${
                        race.Circuit.circuitName
                      }`}
                    />

                  ) : (

                    <span>
                      TRAÇADO INDISPONÍVEL
                    </span>

                  )}

                </div>

                {/* DATA */}

                <div className="race-card-date">

                  <strong>
                    {formatDate(race.date)}
                  </strong>

                  {race.time && (
                    <div className="race-times">

                      <div>
                        <span>BRASIL</span>

                        <strong>
                          {formatRaceTime(
                            race.date,
                            race.time,
                            "America/Sao_Paulo",
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>LOCAL</span>

                        <strong>
                          {formatRaceTime(
                            race.date,
                            race.time,
                            circuitTimezones[
                              race.Circuit?.circuitId
                            ],
                          )}
                        </strong>
                      </div>

                    </div>
                  )}

                </div>

                {/* VENCEDOR */}

                <div className="race-winner">

                  <span>VENCEDOR</span>

                  {winner ? (
                    <>

                      <strong>
                        <Trophy
                          size={13}
                          className="race-winner-trophy"
                        />{" "}
                        {winner.Driver?.givenName}{" "}
                        {winner.Driver?.familyName}
                      </strong>

                      <small>
                        {winner.Constructor?.name}
                      </small>

                    </>
                  ) : (

                    <strong>
                      A DEFINIR
                    </strong>

                  )}

                </div>

                {/* RODAPÉ */}

                <div className="race-card-footer">

                  <span>
                    {isCompleted
                      ? "ETAPA CONCLUÍDA"
                      : "STATUS SESSÃO"}
                  </span>

                  <b
                    className={
                      isCompleted
                        ? ""
                        : "green"
                    }
                  >
                    {isCompleted
                      ? "✓ CONCLUÍDA"
                      : "A SEGUIR"}
                  </b>

                </div>

              </article>
            );
          })}

        </div>

      </section>

      {/* =================================
          RESUMO
      ================================= */}

      <section className="calendar-summary">

        <div className="summary-card">

          <span>TOTAL DE CORRIDAS</span>

          <strong>
            {calendarInfo.total}
          </strong>

          <small>
            GRAND PRIX NA TEMPORADA
          </small>

        </div>

        <div className="summary-card">

          <span>ETAPAS CONCLUÍDAS</span>

          <strong>
            {calendarInfo.completed}
          </strong>

          <small>
            CORRIDAS REALIZADAS
          </small>

        </div>

        <div className="summary-card">

          <span>PRÓXIMAS ETAPAS</span>

          <strong>
            {calendarInfo.remaining}
          </strong>

          <small>
            CORRIDAS RESTANTES
          </small>

        </div>

        <div className="summary-card">

          <span>PRÓXIMO ROUND</span>

          <strong>
            {calendarInfo.nextRace
              ? `R${calendarInfo.nextRace.race.round}`
              : "--"}
          </strong>

          <small>
            {calendarInfo.nextRace?.race
              ?.raceName ||
              "TEMPORADA ENCERRADA"}
          </small>

        </div>

      </section>

    </main>
  );
}

/*
 * =================================
 * FORMATAR DATA
 * =================================
 */

function formatDate(date) {
  if (!date) {
    return "--";
  }

  const [year, month, day] =
    date.split("-");

  return `${day}/${month}/${year}`;
}

export default Calendar;