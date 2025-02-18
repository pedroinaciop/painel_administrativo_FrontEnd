package com.administrative.painel.model;

import com.administrative.painel.dto.ProductDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import lombok.*;

@EqualsAndHashCode(of = "product_id")
@Entity(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long product_id;
    private String productName;
    private String referenceCode;
    private BigDecimal price;
    private BigDecimal pricePromocional;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider;

    private Integer stockAlert;
    private String color;
    private String size;
    private String barCodeField;
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private Integer packagingQuantity;
    private String unity;
    private Double netWeight;
    private Double grossWeight;
    private String dimension;
    private String anvisaRegister;
    private String origin;
    private String stockLocation;
    private String icms;
    private String cfop;
    private String ncm;
    private String cst;
    private String image;
    private Boolean active;
    private Boolean sterility;
    private Boolean freeShipping;
    private Boolean perishable;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
    private Date updateDate;
    private String updateUser;

    public Product() {}

    public Product(Long product_id, String productName, String referenceCode, BigDecimal price, BigDecimal pricePromocional, Provider provider, Integer stockAlert, String color, String size, String barCodeField, String description, Category category, Integer packagingQuantity, String unity, Double netWeight, Double grossWeight, String dimension, String anvisaRegister, String origin, String stockLocation, String icms, String cfop, String ncm, String cst, String image, Boolean active, Boolean sterility, Boolean freeShipping, Boolean perishable, Date updateDate, String updateUser) {
        this.product_id = product_id;
        this.productName = productName;
        this.referenceCode = referenceCode;
        this.price = price;
        this.pricePromocional = pricePromocional;
        this.provider = provider;
        this.stockAlert = stockAlert;
        this.color = color;
        this.size = size;
        this.barCodeField = barCodeField;
        this.description = description;
        this.category = category;
        this.packagingQuantity = packagingQuantity;
        this.unity = unity;
        this.netWeight = netWeight;
        this.grossWeight = grossWeight;
        this.dimension = dimension;
        this.anvisaRegister = anvisaRegister;
        this.origin = origin;
        this.stockLocation = stockLocation;
        this.icms = icms;
        this.cfop = cfop;
        this.ncm = ncm;
        this.cst = cst;
        this.image = image;
        this.active = active;
        this.sterility = sterility;
        this.freeShipping = freeShipping;
        this.perishable = perishable;
        this.updateDate = updateDate;
        this.updateUser = updateUser;
    }

    public Product(ProductDTO dados) {
        this.product_id = dados.product_id();
        this.productName = dados.productName();
        this.referenceCode = dados.referenceCode();
        this.price = dados.price();
        this.pricePromocional = dados.pricePromocional();
        this.provider = dados.provider();
        this.stockAlert = dados.stockAlert();
        this.color = dados.color();
        this.size = dados.size();
        this.barCodeField = dados.barCodeField();
        this.description = dados.description();
        this.category = dados.category();
        this.packagingQuantity = dados.packagingQuantity();
        this.unity = dados.unity();
        this.netWeight = dados.netWeight();
        this.grossWeight = dados.grossWeight();
        this.dimension = dados.dimension();
        this.anvisaRegister = dados.anvisaRegister();
        this.origin = dados.origin();
        this.stockLocation = dados.stockLocation();
        this.icms = dados.icms();
        this.cfop = dados.cfop();
        this.ncm = dados.ncm();
        this.cst = dados.cst();
        this.image = dados.image();
        this.active = dados.active();
        this.sterility = dados.sterility();
        this.freeShipping = dados.freeShipping();
        this.perishable = dados.perishable();
        this.updateDate = dados.updateDate();
        this.updateUser = dados.updateUser();
    }

    public Long getProduct_id() {
        return product_id;
    }

    public String getProductName() {
        return productName;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getPricePromocional() {
        return pricePromocional;
    }

    public Provider getProvider() {
        return provider;
    }

    public Integer getStockAlert() {
        return stockAlert;
    }

    public String getColor() {
        return color;
    }

    public String getSize() {
        return size;
    }

    public String getBarCodeField() {
        return barCodeField;
    }

    public String getDescription() {
        return description;
    }

    public Category getCategory() {
        return category;
    }

    public Integer getPackagingQuantity() {
        return packagingQuantity;
    }

    public String getUnity() {
        return unity;
    }

    public Double getNetWeight() {
        return netWeight;
    }

    public Double getGrossWeight() {
        return grossWeight;
    }

    public String getDimension() {
        return dimension;
    }

    public String getAnvisaRegister() {
        return anvisaRegister;
    }

    public String getOrigin() {
        return origin;
    }

    public String getStockLocation() {
        return stockLocation;
    }

    public String getIcms() {
        return icms;
    }

    public String getCfop() {
        return cfop;
    }

    public String getNcm() {
        return ncm;
    }

    public String getCst() {
        return cst;
    }

    public String getImage() {
        return image;
    }

    public Boolean getActive() {
        return active;
    }

    public Boolean getSterility() {
        return sterility;
    }

    public Boolean getFreeShipping() {
        return freeShipping;
    }

    public Boolean getPerishable() {
        return perishable;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public String getUpdateUser() {
        return updateUser;
    }
}
