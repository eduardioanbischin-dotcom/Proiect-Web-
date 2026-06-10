package com.rental.rental_management.controller;

import com.rental.rental_management.model.Apartment;
import com.rental.rental_management.service.ApartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/apartments")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;

    @GetMapping
    public List<Apartment> getAll() {
        return apartmentService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Apartment> getById(@PathVariable Long id) {
        return ResponseEntity.ok(apartmentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Apartment> create(@RequestBody Apartment apartment) {
        return ResponseEntity.ok(apartmentService.create(apartment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Apartment> update(@PathVariable Long id, @RequestBody Apartment apartment) {
        return ResponseEntity.ok(apartmentService.update(id, apartment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        apartmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}