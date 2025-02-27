package com.crown.DoneZo.service;

import com.crown.DoneZo.entity.Verification;
import com.crown.DoneZo.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationRepository verificationRepository;

    public Verification getVerificationByEmail(String email){
        return verificationRepository.findByEmail(email).orElseThrow(
                () -> new InvalidParameterException("Unexpected Parameters..."));
    }

}
