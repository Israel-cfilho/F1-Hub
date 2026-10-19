package com.f1hub.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverStanding {

    private String position;
    private String positionText;
    private String points;
    private String wins;

    private Driver Driver;

    private List<Constructor> Constructors;
}