
package com.f1hub.backend.service;

import com.f1hub.backend.dto.CalendarRaceDto;
import com.f1hub.backend.dto.DriverSeasonStatsDto;
import com.f1hub.backend.model.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JolpicaService {

    private final WebClient webClient;

    public JolpicaService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.jolpi.ca/ergast/f1")
                .build();
    }

    public JolpicaResponse getCurrentSeason() {
        return webClient
                .get()
                .uri("/current.json")
                .retrieve()
                .bodyToMono(JolpicaResponse.class)
                .block();
    }

    // Resultados dos vencedores da temporada
    public JolpicaResponse getSeasonWinners(String season) {
        return webClient
                .get()
                .uri("/{season}/results/1.json?limit=100", season)
                .retrieve()
                .bodyToMono(JolpicaResponse.class)
                .block();
    }

    public List<CalendarRaceDto> getCalendar() {

        JolpicaResponse calendarResponse = getCurrentSeason();

        if (calendarResponse == null
                || calendarResponse.getMrData() == null
                || calendarResponse.getMrData().getRaceTable() == null
                || calendarResponse.getMrData().getRaceTable().getRaces() == null
                || calendarResponse.getMrData().getRaceTable().getRaces().isEmpty()) {
            return List.of();
        }

        List<Race> races = calendarResponse
                .getMrData()
                .getRaceTable()
                .getRaces();

        String season = races.get(0).getSeason();

        JolpicaResponse winnersResponse = getSeasonWinners(season);

        List<Race> winnerRaces = winnersResponse != null
                && winnersResponse.getMrData() != null
                && winnersResponse.getMrData().getRaceTable() != null
                && winnersResponse.getMrData().getRaceTable().getRaces() != null
                ? winnersResponse.getMrData().getRaceTable().getRaces()
                : List.of();

        return races.stream()
                .map(race -> {

                    Result winner = winnerRaces.stream()
                            .filter(winnerRace ->
                                    winnerRace.getRound().equals(race.getRound()))
                            .filter(winnerRace ->
                                    winnerRace.getResults() != null
                                            && !winnerRace.getResults().isEmpty())
                            .map(winnerRace ->
                                    winnerRace.getResults().get(0))
                            .findFirst()
                            .orElse(null);

                    return new CalendarRaceDto(race, winner);
                })
                .toList();
    }

    public Result getRaceWinner(String season, String round) {

        JolpicaResponse response = webClient
                .get()
                .uri("/{season}/{round}/results.json", season, round)
                .retrieve()
                .bodyToMono(JolpicaResponse.class)
                .block();

        if (response == null
                || response.getMrData() == null
                || response.getMrData().getRaceTable() == null
                || response.getMrData().getRaceTable().getRaces() == null
                || response.getMrData().getRaceTable().getRaces().isEmpty()) {
            return null;
        }

        Race race = response
                .getMrData()
                .getRaceTable()
                .getRaces()
                .get(0);

        if (race.getResults() == null || race.getResults().isEmpty()) {
            return null;
        }

        return race.getResults()
                .stream()
                .filter(result -> "1".equals(result.getPosition()))
                .findFirst()
                .orElse(null);
    }

    public List<DriverStanding> getDriverStandings() {

        JolpicaResponse response = webClient
                .get()
                .uri("/current/driverstandings.json")
                .retrieve()
                .bodyToMono(JolpicaResponse.class)
                .block();

        if (response == null
                || response.getMrData() == null
                || response.getMrData().getStandingsTable() == null
                || response.getMrData().getStandingsTable().getStandingsLists() == null
                || response.getMrData().getStandingsTable().getStandingsLists().isEmpty()) {
            return List.of();
        }

        List<DriverStanding> standings = response
                .getMrData()
                .getStandingsTable()
                .getStandingsLists()
                .get(0)
                .getDriverStandings();

        return standings != null ? standings : List.of();
    }

    public Race getLastRace() {

        JolpicaResponse response = webClient
                .get()
                .uri("/current/last/results.json")
                .retrieve()
                .bodyToMono(JolpicaResponse.class)
                .block();

        if (response == null
                || response.getMrData() == null
                || response.getMrData().getRaceTable() == null
                || response.getMrData().getRaceTable().getRaces() == null
                || response.getMrData().getRaceTable().getRaces().isEmpty()) {
            return null;
        }

        return response
                .getMrData()
                .getRaceTable()
                .getRaces()
                .get(0);
    }

    public List<ConstructorStanding> getConstructorStandings() {

        List<DriverStanding> driverStandings = getDriverStandings();

        Map<String, ConstructorStanding> teams = new HashMap<>();

        for (DriverStanding standing : driverStandings) {

            if (standing.getConstructors() == null
                    || standing.getConstructors().isEmpty()) {
                continue;
            }

            Constructor constructor = standing.getConstructors().get(0);
            String constructorId = constructor.getConstructorId();

            ConstructorStanding current = teams.get(constructorId);

            if (current == null) {
                current = new ConstructorStanding();
                current.setPosition("0");
                current.setConstructor(constructor);
                current.setPoints("0");
                current.setWins("0");

                teams.put(constructorId, current);
            }

            double points = Double.parseDouble(current.getPoints());
            double driverPoints = Double.parseDouble(standing.getPoints());

            int wins = Integer.parseInt(current.getWins());
            int driverWins = Integer.parseInt(standing.getWins());

            current.setPoints(String.valueOf(points + driverPoints));
            current.setWins(String.valueOf(wins + driverWins));
        }

        List<ConstructorStanding> result =
                new ArrayList<>(teams.values());

        result.sort((a, b) ->
                Double.compare(
                        Double.parseDouble(b.getPoints()),
                        Double.parseDouble(a.getPoints())
                )
        );

        for (int i = 0; i < result.size(); i++) {
            result.get(i).setPosition(String.valueOf(i + 1));
        }

        return result;
    }

    // Busca os resultados de uma posição específica.
    private JolpicaResponse getResultsByPosition(String position) {
        return webClient
                .get()
                .uri("/current/results/{position}.json?limit=100", position)
                .retrieve()
                .bodyToMono(JolpicaResponse.class)
                .block();
    }

    // Estatísticas reais de vitórias e pódios por piloto.
    public List<DriverSeasonStatsDto> getDriverSeasonStats() {

        Map<String, DriverSeasonStatsDto> stats = new HashMap<>();

        // Posições 1, 2 e 3: três consultas para toda a temporada.
        for (int position = 1; position <= 3; position++) {

            JolpicaResponse response =
                    getResultsByPosition(String.valueOf(position));

            if (response == null
                    || response.getMrData() == null
                    || response.getMrData().getRaceTable() == null
                    || response.getMrData().getRaceTable().getRaces() == null) {
                continue;
            }

            for (Race race : response
                    .getMrData()
                    .getRaceTable()
                    .getRaces()) {

                if (race.getResults() == null) {
                    continue;
                }

                for (Result result : race.getResults()) {

                    if (result.getDriver() == null
                            || result.getDriver().getDriverId() == null) {
                        continue;
                    }

                    // Confirma a posição para evitar contar resultados indevidos.
                    if (!String.valueOf(position).equals(result.getPosition())) {
                        continue;
                    }

                    String driverId =
                            result.getDriver().getDriverId();

                    DriverSeasonStatsDto driverStats =
                            stats.computeIfAbsent(
                                    driverId,
                                    id -> new DriverSeasonStatsDto(id, 0, 0)
                            );

                    driverStats.setPodiums(
                            driverStats.getPodiums() + 1
                    );

                    if (position == 1) {
                        driverStats.setWins(
                                driverStats.getWins() + 1
                        );
                    }
                }
            }
        }

        return stats.values()
                .stream()
                .sorted(
                        Comparator.comparingInt(
                                DriverSeasonStatsDto::getPodiums
                        ).reversed()
                )
                .toList();
    }
}
