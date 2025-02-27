package com.crown.DoneZo.service;


import com.crown.DoneZo.entity.User;
import org.springframework.stereotype.Service;

@Service
public interface SessionService {

    void createSession(User user, String refreshToken);

    void validateSession(String refreshToken);

    String logout(User user);
}
