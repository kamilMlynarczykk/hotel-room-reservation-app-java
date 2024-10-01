package com.kamil.room_resrvation_app.persistance.model.embedded;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@Builder
public class RoomContent {
    @NotNull
    @Min(0)
    private Integer chairs;

    @NotNull
    @Min(0)
    private Integer beds;

    @NotNull
    @Min(0)
    private Integer desks;

    @NotNull
    @Min(0)
    private Integer balconies;

    @NotNull
    @Min(0)
    private Integer tvs;

    @NotNull
    @Min(0)
    private Integer fridges;

    @NotNull
    @Min(0)
    private Integer kettles;
}
