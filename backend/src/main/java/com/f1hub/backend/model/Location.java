package com.f1hub.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    private String lat;

    @JsonProperty("long")
    private String longitude;
    private String locality;
    private String country;
}
