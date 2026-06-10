package com.rental.rental_management.controller;

import com.rental.rental_management.model.MaintenanceRequest;
import com.rental.rental_management.service.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    @GetMapping
    public List<MaintenanceRequest> getAll() {
        return maintenanceRequestService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> getById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceRequestService.getById(id));
    }

    @GetMapping("/apartment/{apartmentId}")
    public List<MaintenanceRequest> getByApartment(@PathVariable Long apartmentId) {
        return maintenanceRequestService.getByApartment(apartmentId);
    }

    @GetMapping("/status/{status}")
    public List<MaintenanceRequest> getByStatus(@PathVariable MaintenanceRequest.MaintenanceStatus status) {
        return maintenanceRequestService.getByStatus(status);
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(@RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceRequestService.create(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MaintenanceRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam MaintenanceRequest.MaintenanceStatus status) {
        return ResponseEntity.ok(maintenanceRequestService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}