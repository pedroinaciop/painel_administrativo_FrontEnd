package com.administrative.painel.service;

import com.administrative.painel.dto.CompanyDTO;
import com.administrative.painel.model.Company;
import com.administrative.painel.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public List<CompanyDTO> getCompanies() {
        return convertData(companyRepository.findAll());
    }


    public List<CompanyDTO> convertData(List<Company> companies) {
        return companies
                .stream()
                .map(c -> new CompanyDTO(c.getCompany_id(), c.getCnpj(), c.getCorporateReason(), c.getStateRegistration(), c.getEmail(), c.getPhone(), c.getCep(), c.getStreet(), c.getNumberAddress(), c.getNeighborhood(), c.getCity(), c.getState(), c.getComplement(), c.getUpdateDate(), c.getUpdateUser()))
                .collect(Collectors.toList());
    }

}
