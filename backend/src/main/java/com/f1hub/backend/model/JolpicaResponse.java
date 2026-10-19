package com.f1hub.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class JolpicaResponse {

    @JsonProperty("MRData")
    private MRData mrData;

    public MRData getMrData() {
        return mrData;
    }

    public void setMrData(MRData mrData) {
        this.mrData = mrData;
    }
}