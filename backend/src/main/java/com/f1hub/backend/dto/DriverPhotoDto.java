package com.f1hub.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DriverPhotoDto {

    @JsonProperty("name_acronym")
    private String driverId;

    @JsonProperty("full_name")
    private String name;

    @JsonProperty("team_name")
    private String teamName;

    @JsonProperty("headshot_url")
    private String headshotUrl;

    @JsonProperty("driver_number")
    private Integer driverNumber;
}