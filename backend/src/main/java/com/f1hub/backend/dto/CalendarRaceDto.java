package com.f1hub.backend.dto;

import com.f1hub.backend.model.Race;
import com.f1hub.backend.model.Result;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarRaceDto {

    private Race race;
    private Result winner;
}