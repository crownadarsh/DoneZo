package com.crown.DoneZo.service;


import com.crown.DoneZo.dto.input.SendOtpDto;
import com.crown.DoneZo.dto.input.VerifyOtpDto;


public interface OtpService {
    String sendOtp(SendOtpDto sendOtpDto);

    String verifyOtp(VerifyOtpDto verifyOtpDto);

}
