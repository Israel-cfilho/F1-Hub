package com.f1hub.backend.service;

import com.f1hub.backend.dto.DriverPhotoDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class OpenF1Service {

    private final WebClient webClient;

    public OpenF1Service() {
        this.webClient =
                WebClient.create("https://api.openf1.org/v1");
    }

    public List<DriverPhotoDto> getDriverPhotos() {
        DriverPhotoDto[] drivers = webClient.get()
                .uri("/drivers?session_key=latest")
                .retrieve()
                .bodyToMono(DriverPhotoDto[].class)
                .block();

        return drivers == null
                ? List.of()
                : List.of(drivers);
    }
}