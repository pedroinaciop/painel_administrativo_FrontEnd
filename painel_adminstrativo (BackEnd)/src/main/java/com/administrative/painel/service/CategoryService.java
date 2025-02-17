package com.administrative.painel.service;

import com.administrative.painel.dto.CategoryDTO;
import com.administrative.painel.model.Category;
import com.administrative.painel.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;;

    public List<CategoryDTO> getCategories() {
        return(convertData(categoryRepository.findAll()));
    }

    public List<CategoryDTO> convertData(List<Category> categories) {
        return categories
                .stream()
                .map(c -> new CategoryDTO(c.getCategory_id(), c.getCategoryName(), c.getUpdateDate(), c.getUpdateUser()))
                .collect(Collectors.toList());
    }


}
