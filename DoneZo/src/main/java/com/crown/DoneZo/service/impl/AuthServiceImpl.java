package com.crown.DoneZo.service.impl;

import com.crown.DoneZo.dto.input.ForgetPasswordDto;
import com.crown.DoneZo.dto.input.LoginDto;
import com.crown.DoneZo.dto.input.SignUpDto;
import com.crown.DoneZo.dto.output.LoginResponseDto;
import com.crown.DoneZo.dto.output.UserDto;
import com.crown.DoneZo.entity.User;
import com.crown.DoneZo.service.AuthService;
import com.crown.DoneZo.service.JwtService;
import com.crown.DoneZo.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl userService;
    private final JwtService jwtService;
    private final SessionServiceImpl sessionService;
    private final VerificationService verificationService;
    private final PasswordEncoder passwordEncoder;



    @Override
    @Transactional
    public UserDto signup(SignUpDto signupDto) {
        if(!verificationService.getVerificationByEmail(signupDto.getEmail()).getIsVerified()){
            throw new AuthenticationServiceException("Email is not Verified.");
        }
        User user = userService.createUser(signupDto);
        return modelMapper.map(user, UserDto.class);
    }



    @Override
    public LoginResponseDto login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        String accessToken =  jwtService.generateAccessToken(user);
        String refreshToken =  jwtService.generateRefreshToken(user);

        sessionService.createSession(user, refreshToken);

        return new LoginResponseDto(user.getId(), accessToken, refreshToken, authentication.isAuthenticated());

    }

    @Override
    public String forgetPassword(ForgetPasswordDto forgetPasswordDto) {
        User user = userService.getUserByEmail(forgetPasswordDto.getEmail());
        if(!verificationService.getVerificationByEmail(user.getEmail()).getIsVerified()){
            throw new RuntimeException("Unauthorized access");
        }
        user.setPassword(passwordEncoder.encode(forgetPasswordDto.getPassword()));
        userService.updateUser(user);
        return "Password updated successfully.";
    }

    @Override
    public LoginResponseDto refresh(String refreshToken) {
        Long userId = jwtService.getUserIdFromToken(refreshToken);
        sessionService.validateSession(refreshToken);
        User user = userService.findUserById(userId);

        String accessToken =  jwtService.generateAccessToken(user);
        return new LoginResponseDto(userId, accessToken, refreshToken, true);
    }


}
