package com.administrative.painel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record CompanyDTO(
                 Long company_id,
                 String cnpj,
                 String corporateReason,
                 String stateRegistration,
                 String email,
                 String phone,
                 String cep,
                 String street,
                 Integer numberAddress,
                 String neighborhood,
                 String city,
                 String state,
                 String complement,
                 @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
                 Date updateDate,
                 String updateUser) {
}
