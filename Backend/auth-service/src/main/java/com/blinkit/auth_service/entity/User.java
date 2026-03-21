package com.blinkit.auth_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Table(name="users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="u_id")
    private Long id;

    @Column(name="u_email", unique = true,nullable = false,length=150)
    private String email;

    @Column(name="u_name", nullable = false)
    private String name;

    @Column(name="u_phoneNumber" ,unique = true, nullable = false)
    private String phoneNumber;

    @Column(name="u_isVerified",nullable = false)
    private boolean isVerified;

    @Column(name="u_createdOn",nullable = false)
    private LocalDateTime createdOn;

    @Column(name="u_password",nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name="u_role",nullable = false)
    private Role role;
}
