package com.rental.rental_management.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "apartments")
public class Apartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private Integer floor;
    private Double rentPrice;

    @Enumerated(EnumType.STRING)
    private ApartmentStatus status;

    public enum ApartmentStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE
    }
}