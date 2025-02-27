package com.crown.DoneZo.service;

import com.crown.DoneZo.dto.input.EditPasswordDto;
import com.crown.DoneZo.dto.input.SignUpDto;
import com.crown.DoneZo.dto.output.UserProfileDto;
import com.crown.DoneZo.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;


@Service
public interface UserService extends UserDetailsService {

    User findUserById(Long userId);

    User createUser(SignUpDto signupDto);

    User getUserByEmail(String email);

    UserProfileDto getMyProfile();

    String editPassword(EditPasswordDto editPasswordDto);

    User getCurrentUser();

    void updateUser(com.crown.DoneZo.entity.User user);


    String logout();
}
