package com.f1hub.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MRData {

    @JsonProperty("RaceTable")
    private RaceTable raceTable;

    @JsonProperty("StandingsTable")
    private StandingsTable standingsTable;
}