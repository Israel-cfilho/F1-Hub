package com.f1hub.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandingsTable {

    private String season;

    @JsonProperty("StandingsLists")
    private List<StandingsList> standingsLists;
}