package com.administrative.painel.controller;

import com.administrative.painel.dto.*;
import com.administrative.painel.model.*;
import com.administrative.painel.repository.*;
import com.administrative.painel.service.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping()
public class AdministrativePanelController {
    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ProviderService providerService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    /*Provider*/

    @GetMapping("/fornecedores")
    public List<ProviderDTO> findAllCategory() {
        return providerService.getProviders();
    }

    @Transactional
    @PostMapping("/cadastros/fornecedores/novo")
    public void registerProvider(@RequestBody ProviderDTO dados) {
        providerRepository.save(new Provider(dados));
    }

    @Transactional
    @DeleteMapping("/fornecedores/{id}")
    public void deleteProvider(@PathVariable("id") Long id) {
        providerRepository.deleteById(id);
    }

    /*User*/

    @GetMapping("/usuarios")
    public List<UserDTO> findAllUsers() {
        return userService.getUsers();
    }

    @Transactional
    @PostMapping("/cadastros/usuarios/novo")
    public void registerUser(@RequestBody UserDTO dados) {
        userRepository.save(new User(dados));
    }

    @Transactional
    @DeleteMapping("usuarios/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userRepository.deleteById(id);
    }

    /*Category*/

    @GetMapping("/categorias")
    public List<CategoryDTO> findAllCategories() {
        return categoryService.getCategories();
    }

    @Transactional
    @PostMapping("/cadastros/categorias/novo")
    public void registerCategory(@RequestBody CategoryDTO dados) {
        categoryRepository.save(new Category(dados));
    }

    @Transactional
    @DeleteMapping("categorias/{id}")
    public void deleteCategory(@PathVariable("id") Long id) {
        categoryRepository.deleteById(id);
    }

    /*Company*/

    @GetMapping("/empresas")
    public List<CompanyDTO> findAllCompanies() {
       return companyService.getCompanies();
    }

    @Transactional
    @PostMapping("cadastros/empresas/novo")
    public void createCompany(@RequestBody CompanyDTO dados) {
        companyRepository.save(new Company(dados));
    }

    @Transactional
    @DeleteMapping("/empresas/{id}")
    public void deleteCompany(@PathVariable("id") Long id) {
        companyRepository.deleteById(id);
    }

    /*Product*/

    @GetMapping("/produtos")
    public List<ProductDTO> findAllProducts() {
        return productService.getProducts();
    }

    @Transactional()
    @DeleteMapping("/produtos/{id}")
    public void deleteProduct(@PathVariable("id") Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    @PostMapping("cadastros/produtos/novo")
    public void createProduct(@RequestBody ProductDTO dados) {
        productRepository.save(new Product(dados));
    }
}
