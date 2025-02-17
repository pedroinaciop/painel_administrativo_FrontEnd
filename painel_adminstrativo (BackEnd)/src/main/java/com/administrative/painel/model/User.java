package com.administrative.painel.model;

import com.administrative.painel.dto.UserDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.util.Date;
import lombok.*;

@EqualsAndHashCode(of = "user_id")
@Entity(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;
    @Column(length = 60)
    private String fullName;
    @Column(unique = true)
    private String email;
    private String password;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
    private Date updateDate;
    private String updateUser;

    public User() {
    }

    public User(Long user_id, String fullName, String email, String password) {
        this.user_id = user_id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    public User(UserDTO dados) {
        this.user_id = dados.user_id();
        this.fullName = dados.fullName();
        this.email = dados.email();
        this.password = dados.password();
        this.updateDate = dados.updateDate();
        this.updateUser = dados.updateUser();
    }

    public Long getUser_id() {
        return user_id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public String getUpdateUser() {
        return updateUser;
    }
}