package com.rental.rental_management.service;

import com.rental.rental_management.model.MaintenanceRequest;
import com.rental.rental_management.repository.MaintenanceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public List<MaintenanceRequest> getAll() {
        return maintenanceRequestRepository.findAll();
    }

    public MaintenanceRequest getById(Long id) {
        return maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cererea nu a fost gasita"));
    }

    public List<MaintenanceRequest> getByApartment(Long apartmentId) {
        return maintenanceRequestRepository.findByApartmentId(apartmentId);
    }

    public List<MaintenanceRequest> getByStatus(MaintenanceRequest.MaintenanceStatus status) {
        return maintenanceRequestRepository.findByStatus(status);
    }

    public MaintenanceRequest create(MaintenanceRequest request) {
        request.setRequestDate(LocalDate.now());
        request.setStatus(MaintenanceRequest.MaintenanceStatus.OPEN);
        return maintenanceRequestRepository.save(request);
    }

    public MaintenanceRequest updateStatus(Long id, MaintenanceRequest.MaintenanceStatus status) {
        MaintenanceRequest request = getById(id);
        request.setStatus(status);
        if (status == MaintenanceRequest.MaintenanceStatus.RESOLVED) {
            request.setResolvedDate(LocalDate.now());
        }
        return maintenanceRequestRepository.save(request);
    }

    public void delete(Long id) {
        maintenanceRequestRepository.deleteById(id);
    }
}