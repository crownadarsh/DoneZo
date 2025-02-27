package com.crown.DoneZo.service;


import com.crown.DoneZo.dto.input.ForgetPasswordDto;
import com.crown.DoneZo.dto.input.LoginDto;
import com.crown.DoneZo.dto.input.SignUpDto;
import com.crown.DoneZo.dto.output.LoginResponseDto;
import com.crown.DoneZo.dto.output.UserDto;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    UserDto signup(SignUpDto signupDto);

    LoginResponseDto login(LoginDto loginDto);

    String forgetPassword(ForgetPasswordDto forgetPasswordDto);

    LoginResponseDto refresh(String refreshToken);

}