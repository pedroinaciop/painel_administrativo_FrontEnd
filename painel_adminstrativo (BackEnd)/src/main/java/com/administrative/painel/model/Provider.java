package com.administrative.painel.model;

import com.administrative.painel.dto.ProviderDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;
import lombok.*;

@EqualsAndHashCode(of = "provider_id")
@Entity(name = "providers")
public class Provider {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long provider_id;

    @Column(unique = true, nullable = false, length = 14)
    private String cnpj;

    @Column(nullable = false, length = 80)
    private String provider;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
    private Date updateDate;
    private String updateUser;

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;

    public Provider() {}

    public Provider(ProviderDTO dados) {
        this.provider_id = dados.provider_id();
        this.cnpj = dados.cnpj();
        this.provider = dados.provider();
        this.updateDate = dados.updateDate();
        this.updateUser = dados.updateUser();
    }

    public Provider(Long provider_id, String cnpj, String provider, Date updateDate, String updateUser) {
        this.provider_id = provider_id;
        this.cnpj = cnpj;
        this.provider = provider;
        this.updateDate = updateDate;
        this.updateUser = updateUser;
    }

    public List<Product> getProducts() {
        return products;
    }

    public Long getProvider_id() {
        return provider_id;
    }

    public String getCnpj() {
        return cnpj;
    }

    public String getProvider() {
        return provider;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public String getUpdateUser() {
        return updateUser;
    }
}