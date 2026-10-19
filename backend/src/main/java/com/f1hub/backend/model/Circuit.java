package com.f1hub.backend.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Circuit {
    private String circuitId;
    private String url;
    private String circuitName;

    @JsonProperty("Location")
    private Location location;

}
