package com.f1hub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverSeasonStatsDto {

    private String driverId;

    private int wins;

    private int podiums;
}