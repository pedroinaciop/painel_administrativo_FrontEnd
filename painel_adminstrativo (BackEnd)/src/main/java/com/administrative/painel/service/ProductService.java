package com.administrative.painel.service;

import com.administrative.painel.dto.ProductDTO;
import com.administrative.painel.model.Product;
import com.administrative.painel.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductDTO> getProducts() {
        return convertData(productRepository.findAll());
    }

    private List<ProductDTO> convertData(List<Product> products) {
        return products
            .stream()
            .map(p -> new ProductDTO(p.getProduct_id(), p.getProductName(), p.getReferenceCode(), p.getPrice(), p.getPricePromocional(), p.getProvider(),p.getStockAlert(), p.getColor(), p.getSize(), p.getBarCodeField(), p.getDescription(), p.getCategory(), p.getPackagingQuantity(), p.getUnity(), p.getNetWeight(), p.getGrossWeight(), p.getDimension(), p.getAnvisaRegister(), p.getOrigin(), p.getStockLocation(), p.getIcms(), p.getCfop(), p.getNcm(), p.getCst(), p.getImage(), p.getActive(), p.getSterility(), p.getFreeShipping(), p.getPerishable(), p.getUpdateDate(), p.getUpdateUser()))
            .collect(Collectors.toList());
    }

}
