package com.f1hub.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConstructorStanding {

    private String position;

    private String points;

    private String wins;

    private Constructor constructor;
}