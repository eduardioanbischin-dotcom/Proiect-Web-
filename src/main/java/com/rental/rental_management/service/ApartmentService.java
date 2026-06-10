package com.rental.rental_management.service;

import com.rental.rental_management.model.Apartment;
import com.rental.rental_management.repository.ApartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;

    public List<Apartment> getAll() {
        return apartmentRepository.findAll();
    }

    public Apartment getById(Long id) {
        return apartmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apartamentul nu a fost gasit"));
    }

    public Apartment create(Apartment apartment) {
        return apartmentRepository.save(apartment);
    }

    public Apartment update(Long id, Apartment updated) {
        Apartment existing = getById(id);
        existing.setName(updated.getName());
        existing.setAddress(updated.getAddress());
        existing.setFloor(updated.getFloor());
        existing.setRentPrice(updated.getRentPrice());
        existing.setStatus(updated.getStatus());
        return apartmentRepository.save(existing);
    }

    public void delete(Long id) {
        apartmentRepository.deleteById(id);
    }
}