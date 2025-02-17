package com.administrative.painel.service;

import com.administrative.painel.dto.UserDTO;
import com.administrative.painel.model.User;
import com.administrative.painel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> getUsers() {
        return convertData(userRepository.findAll());
    }

    private List<UserDTO> convertData(List<User> users) {
        return users
                .stream()
                .map(u -> new UserDTO(u.getUser_id(), u.getFullName(), u.getEmail(), u.getPassword(), u.getUpdateDate(), u.getUpdateUser()))
                .collect(Collectors.toList());
    }

}
