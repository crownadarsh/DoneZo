package com.crown.DoneZo.controller;

import com.crown.DoneZo.dto.input.SendOtpDto;
import com.crown.DoneZo.dto.input.VerifyOtpDto;
import com.crown.DoneZo.service.impl.OtpServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

    private final OtpServiceImpl otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody SendOtpDto sendOtpDto){
        return ResponseEntity.ok(otpService.sendOtp(sendOtpDto));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpDto verifyOtpDto){
        return ResponseEntity.ok(otpService.verifyOtp(verifyOtpDto));
    }



}
