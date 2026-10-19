package com.f1hub.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FastestLap {

    private String rank;
    private String lap;

    @JsonProperty("Time")
    private LapTime time;

    @JsonProperty("AverageSpeed")
    private AverageSpeed averageSpeed;
}