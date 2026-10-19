package com.f1hub.backend.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Race {
    private String season;
    private String round;
    private String url;
    private String raceName;
    private String date;
    private String time;

    @JsonProperty("FirstPractice")
    private Session firstPractice;

    @JsonProperty("SecondPractice")
    private Session secondPractice;

    @JsonProperty("ThirdPractice")
    private Session thirdPractice;

    @JsonProperty("Qualifying")
    private Session qualifying;

    @JsonProperty("Sprint")
    private Session sprint;

    @JsonProperty("SprintQualifying")
    private Session sprintQualifying;

    @JsonProperty("SprintShootout")
    private Session sprintShootout;

    @JsonProperty("Circuit")
    private Circuit circuit;

    @JsonProperty("Results")
    private List<Result> results;
}
