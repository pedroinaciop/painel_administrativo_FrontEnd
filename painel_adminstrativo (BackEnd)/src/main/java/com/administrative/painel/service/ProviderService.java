package com.administrative.painel.service;

import com.administrative.painel.dto.ProviderDTO;
import com.administrative.painel.model.Provider;
import com.administrative.painel.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    public List<ProviderDTO> getProviders() {
        return convertData(providerRepository.findAll());
    }

    private List<ProviderDTO> convertData(List<Provider> providers) {
        return providers
                .stream()
                .map(p -> new ProviderDTO(p.getProvider_id(), p.getCnpj(), p.getProvider(), p.getUpdateDate(), p.getUpdateUser()))
                .collect(Collectors.toList());
    }
}
