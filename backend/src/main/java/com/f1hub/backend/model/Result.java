package com.f1hub.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    private String number;
    private String position;
    private String positionText;
    private String points;

    private Driver Driver;
    private Constructor Constructor;

    private String grid;
    private String laps;
    private String status;

    @JsonProperty("FastestLap")
    private FastestLap fastestLap;
}