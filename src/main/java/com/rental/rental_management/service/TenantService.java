package com.rental.rental_management.service;

import com.rental.rental_management.model.Tenant;
import com.rental.rental_management.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    public List<Tenant> getAll() {
        return tenantRepository.findAll();
    }

    public Tenant getById(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chiriasul nu a fost gasit"));
    }

    public List<Tenant> getByApartment(Long apartmentId) {
        return tenantRepository.findByApartmentId(apartmentId);
    }

    public List<Tenant> getActive() {
        return tenantRepository.findByActive(true);
    }

    public Tenant create(Tenant tenant) {
        tenant.setActive(true);
        return tenantRepository.save(tenant);
    }

    public Tenant update(Long id, Tenant updated) {
        Tenant existing = getById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setContractStartDate(updated.getContractStartDate());
        existing.setContractEndDate(updated.getContractEndDate());
        return tenantRepository.save(existing);
    }

    public void delete(Long id) {
        tenantRepository.deleteById(id);
    }
}