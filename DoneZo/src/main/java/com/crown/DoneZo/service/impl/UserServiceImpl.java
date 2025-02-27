package com.crown.DoneZo.service.impl;

import com.crown.DoneZo.dto.input.EditPasswordDto;
import com.crown.DoneZo.dto.input.SignUpDto;
import com.crown.DoneZo.dto.output.UserProfileDto;
import com.crown.DoneZo.entity.User;
import com.crown.DoneZo.exceptions.ResourceNotFoundException;
import com.crown.DoneZo.repository.UserRepository;
import com.crown.DoneZo.service.SessionService;
import com.crown.DoneZo.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessionService;



    @Override
    public User findUserById(Long userId) {
        return  userRepository.findById(userId).orElseThrow(
                () ->  new ResourceNotFoundException("User is not found with UserId " + userId)
        );
    }

    @Override
    @Transactional
    public User createUser(SignUpDto signupDto) {
        Optional<User> user = userRepository.findByEmail(signupDto.getEmail());
        if(user.isPresent()){
            throw new BadCredentialsException("User with email "+ signupDto.getEmail() +" is already present.");
        }
        User userToSave = modelMapper.map(signupDto, User.class);
        userToSave.setPassword(passwordEncoder.encode(userToSave.getPassword()));
        return userRepository.save(userToSave);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }


    @Override
    public UserProfileDto getMyProfile() {
        User user = getCurrentUser();
        return modelMapper.map(user, UserProfileDto.class);
    }

    @Override
    @Transactional
    public String editPassword(EditPasswordDto editPasswordDto) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!passwordEncoder.matches(editPasswordDto.getOldPassword(), user.getPassword())){
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(editPasswordDto.getNewPassword()));
        updateUser(user);
        return "Password updated successfully...";
    }

    @Override
    public User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    public void updateUser(User user) {
        userRepository.save(user);
    }

    @Override
    public String logout() {
        User user = getCurrentUser();
        return sessionService.logout(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User with email "+ username +" is not found."));

    }
}
