package com.administrative.painel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record UserDTO (
        Long user_id,
        String fullName,
        String email,
        String password,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
        Date updateDate,
        String updateUser) {
}
