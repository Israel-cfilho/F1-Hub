package com.f1hub.backend.controller;


import com.f1hub.backend.dto.CalendarRaceDto;
import com.f1hub.backend.model.JolpicaResponse;
import com.f1hub.backend.model.Race;
import java.util.List;

import com.f1hub.backend.model.Result;
import com.f1hub.backend.service.JolpicaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.f1hub.backend.model.DriverStanding;
import com.f1hub.backend.model.Race;
import com.f1hub.backend.model.ConstructorStanding;
import com.f1hub.backend.dto.DriverSeasonStatsDto;

import com.f1hub.backend.dto.DriverPhotoDto;
import com.f1hub.backend.service.OpenF1Service;

@RestController
@RequestMapping("/api/f1")
public class JolpicaController {

    private final JolpicaService jolpicaService;
    private final OpenF1Service openF1Service;

    public JolpicaController(
            JolpicaService jolpicaService,
            OpenF1Service openF1Service) {
        this.jolpicaService = jolpicaService;
        this.openF1Service = openF1Service;
    }

    @GetMapping("/current")
    public JolpicaResponse getCurrentSeason() {
        return jolpicaService.getCurrentSeason();
    }

    @GetMapping("/calendar")
    public List<CalendarRaceDto> getCalendar(){
        return jolpicaService.getCalendar();
    }

    @GetMapping("/winner/{season}/{round}")
    public Result getRaceWinner(
            @PathVariable String season,
            @PathVariable String round) {

        return jolpicaService.getRaceWinner(season, round);
    }

    @GetMapping("/standings/drivers")
    public List<DriverStanding> getDriverStandings() {
        return jolpicaService.getDriverStandings();
    }

    @GetMapping("/last-race")
    public Race getLastRace() {
        return jolpicaService.getLastRace();
    }

    @GetMapping("/standings/constructors")
    public List<ConstructorStanding> getConstructorStandings() {
        return jolpicaService.getConstructorStandings();
    }

    @GetMapping("/standings/drivers/stats")
    public List<DriverSeasonStatsDto> getDriverSeasonStats() {
        return jolpicaService.getDriverSeasonStats();
    }

    @GetMapping("/drivers/photos")
    public List<DriverPhotoDto> getDriverPhotos() {
        return openF1Service.getDriverPhotos();
    }


}
