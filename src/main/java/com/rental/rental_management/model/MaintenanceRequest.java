package com.rental.rental_management.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "maintenance_requests")
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    private String title;
    private String description;
    private LocalDate requestDate;
    private LocalDate resolvedDate;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status;

    public enum MaintenanceStatus {
        OPEN, IN_PROGRESS, RESOLVED
    }
}