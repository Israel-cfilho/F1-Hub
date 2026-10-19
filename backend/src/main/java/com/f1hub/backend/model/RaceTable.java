package com.f1hub.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RaceTable {

    private String season;

    @JsonProperty("Races")
    private List<Race> races;

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public List<Race> getRaces() {
        return races;
    }

    public void setRaces(List<Race> races) {
        this.races = races;
    }
}