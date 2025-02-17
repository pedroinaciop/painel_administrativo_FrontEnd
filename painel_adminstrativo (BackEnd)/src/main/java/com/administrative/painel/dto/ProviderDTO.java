package com.administrative.painel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public record ProviderDTO(
        Long provider_id,
        String cnpj,
        String provider,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
        Date updateDate,
        String updateUser) {
}
