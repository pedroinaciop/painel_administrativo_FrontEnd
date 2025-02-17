package com.administrative.painel.model;

import com.administrative.painel.dto.CompanyDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.util.Date;
import lombok.*;

@EqualsAndHashCode(of = "company_id")
@Entity(name = "companies")
public class Company {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long company_id;

    @Column(length = 14, nullable = false)
    private String cnpj;

    @Column(nullable = false)
    private String corporateReason;
    private String stateRegistration;

    @Column(nullable = false)
    private String email;
    private String phone;

    @Column(length = 8, nullable = false)
    private String cep;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private Integer numberAddress;

    @Column(nullable = false)
    private String neighborhood;

    @Column(nullable = false)
    private String city;

    @Column(length = 2, nullable = false)
    private String state;

    @Column(length = 55)
    private String complement;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
    private Date updateDate;
    private String updateUser;

    public Company() {
    }

    public Company(CompanyDTO dados) {
        this.company_id = dados.company_id();
        this.cnpj = dados.cnpj();
        this.corporateReason = dados.corporateReason();
        this.stateRegistration = dados.stateRegistration();
        this.email = dados.email();
        this.phone = dados.phone();
        this.cep = dados.cep();
        this.street = dados.street();
        this.numberAddress = dados.numberAddress();
        this.neighborhood = dados.neighborhood();
        this.city = dados.city();
        this.state = dados.state();
        this.complement = dados.complement();
        this.updateDate = dados.updateDate();
        this.updateUser = dados.updateUser();
    }

    public Company(Long company_id, String cnpj, String corporateReason, String stateRegistration, String email, String phone, String cep, String street, Integer numberAddress, String neighborhood, String city, String state, String complement, Date updateDate, String updateUser) {
        this.company_id = company_id;
        this.cnpj = cnpj;
        this.corporateReason = corporateReason;
        this.stateRegistration = stateRegistration;
        this.email = email;
        this.phone = phone;
        this.cep = cep;
        this.street = street;
        this.numberAddress = numberAddress;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
        this.complement = complement;
        this.updateDate = updateDate;
        this.updateUser = updateUser;
    }

    public Long getCompany_id() {
        return company_id;
    }

    public String getCnpj() {
        return cnpj;
    }

    public String getCorporateReason() {
        return corporateReason;
    }

    public String getStateRegistration() {
        return stateRegistration;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getCep() {
        return cep;
    }

    public String getStreet() {
        return street;
    }

    public Integer getNumberAddress() {
        return numberAddress;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getComplement() {
        return complement;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public String getUpdateUser() {
        return updateUser;
    }
}
