package com.f1hub.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandingsList {

    private String season;
    private String round;

    @JsonProperty("DriverStandings")
    private List<DriverStanding> driverStandings;
}