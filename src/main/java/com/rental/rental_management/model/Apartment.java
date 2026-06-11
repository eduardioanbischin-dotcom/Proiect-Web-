package com.rental.rental_management.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "apartments")
public class Apartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private Double price;

    private String location;

    private String type;

    private Integer rooms;

    private String sellingType;

    private String mainImage;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "apartment_images", joinColumns = @JoinColumn(name = "apartment_id"))
    @Column(name = "image_url", length = 4000)
    private List<String> images = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ApartmentStatus status;

    public enum ApartmentStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE
    }
}