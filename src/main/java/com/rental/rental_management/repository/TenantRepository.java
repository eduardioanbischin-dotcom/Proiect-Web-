package com.rental.rental_management.repository;

import com.rental.rental_management.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    List<Tenant> findByApartmentId(Long apartmentId);
    List<Tenant> findByActive(Boolean active);
}