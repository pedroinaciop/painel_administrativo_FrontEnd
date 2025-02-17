package com.administrative.painel.dto;

import com.administrative.painel.model.Category;
import com.administrative.painel.model.Provider;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.util.Date;

public record ProductDTO (
        Long product_id,
        String productName,
        String referenceCode,
        BigDecimal price,
        BigDecimal pricePromocional,
        Provider provider,
        Integer stockAlert,
        String color,
        String size,
        String barCodeField,
        String description,
        Category category,
        Integer packagingQuantity,
        String unity,
        Double netWeight,
        Double grossWeight,
        String dimension,
        String anvisaRegister,
        String origin,
        String stockLocation,
        String icms,
        String cfop,
        String ncm,
        String cst,
        String image,
        Boolean active,
        Boolean sterility,
        Boolean freeShipping,
        Boolean perishable,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
        Date updateDate,
        String updateUser) {
}
