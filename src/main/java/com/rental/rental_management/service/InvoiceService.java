package com.rental.rental_management.service;

import com.rental.rental_management.model.Invoice;
import com.rental.rental_management.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public List<Invoice> getAll() {
        return invoiceRepository.findAll();
    }

    public Invoice getById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura nu a fost gasita"));
    }

    public List<Invoice> getByTenant(Long tenantId) {
        return invoiceRepository.findByTenantId(tenantId);
    }

    public List<Invoice> getByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }

    public Invoice create(Invoice invoice) {
        invoice.setStatus(Invoice.InvoiceStatus.PENDING);
        return invoiceRepository.save(invoice);
    }

    public Invoice markAsPaid(Long id) {
        Invoice invoice = getById(id);
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        return invoiceRepository.save(invoice);
    }

    public void delete(Long id) {
        invoiceRepository.deleteById(id);
    }
}