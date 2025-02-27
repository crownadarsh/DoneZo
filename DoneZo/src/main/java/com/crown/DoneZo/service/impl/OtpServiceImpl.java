package com.crown.DoneZo.service.impl;

import com.crown.DoneZo.dto.input.SendOtpDto;
import com.crown.DoneZo.dto.input.VerifyOtpDto;
import com.crown.DoneZo.entity.Verification;
import com.crown.DoneZo.entity.enums.VerificationType;
import com.crown.DoneZo.repository.VerificationRepository;
import com.crown.DoneZo.service.EmailService;
import com.crown.DoneZo.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.InvalidParameterException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;
import java.util.Random;

@RequiredArgsConstructor
@Service
public class OtpServiceImpl implements OtpService {

    private final VerificationRepository verificationRepository;
    private final EmailService emailService;
    private final UserServiceImpl userService;

    @Override
    @Transactional
    public String sendOtp(SendOtpDto sendOtpDto) {
        Verification verification;
        if(Objects.equals(sendOtpDto.getVerificationType(), VerificationType.EMAIL_VERIFICATION)){
            if(userService.getUserByEmail(sendOtpDto.getEmail()) != null)
                throw new RuntimeException("User is already registered with email "+ sendOtpDto.getEmail());

            verification = verificationRepository.findByEmail(sendOtpDto.getEmail()).orElse(
                    Verification.builder()
                            .email(sendOtpDto.getEmail())
                            .isVerified(false)
                            .build()
            );
        }else if(Objects.equals(sendOtpDto.getVerificationType(), VerificationType.FORGET_PASSWORD)){
            if(userService.getUserByEmail(sendOtpDto.getEmail()) == null)
                throw new RuntimeException("User is not found with email "+ sendOtpDto.getEmail());

            verification = verificationRepository.findByEmail(sendOtpDto.getEmail()).orElseThrow(
                    () -> new InvalidParameterException("Unexpected Parameters..."));
            verification.setIsVerified(false);
            verification.setCreatedAt(LocalDateTime.now());
        }else{
            throw new RuntimeException("Invalid Verification Type");
        }

        verification.setOtp(createOtp());
        verification.setOtpIsValidAt(new Date(System.currentTimeMillis() + 60 * 1000 * 10));
        Verification savedVerification = verificationRepository.save(verification);

        emailService.sendEmail(savedVerification.getEmail(),"DoneZo email verification",createMessage(savedVerification.getOtp()));
        return "Otp send successfully...";
    }

    @Override
    @Transactional
    public String verifyOtp(VerifyOtpDto verifyOtpDto) {
        Verification verification = verificationRepository.findByEmail(verifyOtpDto.getEmail())
                .orElseThrow(() -> new InvalidParameterException("Unexpected Parameters..."));
        if(verification.getOtpIsValidAt().before(new Date(System.currentTimeMillis())) || !verification.getOtp().equals(verifyOtpDto.getOtp())){
            throw new RuntimeException("Invalid OTP. ");
        }
        verification.setIsVerified(true);
        verificationRepository.save(verification);
        return "Otp verified successfully...";
    }


    private String createOtp() {
        Random random = new Random();
        int otp = random.nextInt(1000000); // Generates a number between 0 and 999999
        return String.format("%06d", otp);
    }

    private String createMessage(String otp){
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>OTP Verification</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            background-color: #f4f4f4;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "        }\n" +
                "        .email-container-wrapper {\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .email-container {\n" +
                "            max-width: 600px;\n" +
                "            margin: 30px auto;\n" +
                "            background-color: #fff;\n" +
                "            border-radius: 8px;\n" +
                "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                "            overflow: hidden;\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .header {\n" +
                "            background-color: #007BFF;\n" +
                "            color: #ffffff;\n" +
                "            text-align: center;\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .header h1 {\n" +
                "            margin: 0;\n" +
                "            font-size: 24px;\n" +
                "        }\n" +
                "        .content {\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .content p {\n" +
                "            font-size: 16px;\n" +
                "            color: #333;\n" +
                "            margin-bottom: 20px;\n" +
                "        }\n" +
                "        .otp-box {\n" +
                "            text-align: center;\n" +
                "            font-size: 28px;\n" +
                "            font-weight: bold;\n" +
                "            padding: 15px;\n" +
                "            background-color: #f0f0f0;\n" +
                "            border-radius: 8px;\n" +
                "            color: #333;\n" +
                "            letter-spacing: 4px;\n" +
                "        }\n" +
                "        .footer {\n" +
                "            text-align: center;\n" +
                "            padding: 20px;\n" +
                "            background-color: #007BFF;\n" +
                "            color: #ffffff;\n" +
                "            font-size: 14px;\n" +
                "        }\n" +
                "        .footer a {\n" +
                "            color: #ffffff;\n" +
                "            text-decoration: none;\n" +
                "        }\n" +
                "        @media (max-width: 600px) {\n" +
                "            .email-container-wrapper {\n" +
                "                padding: 15px;\n" +
                "            }\n" +
                "            .email-container {\n" +
                "                width: 100%;\n" +
                "            }\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"email-container-wrapper\">\n" +
                "        <div class=\"email-container\">\n" +
                "            <div class=\"header\">\n" +
                "                <h1>Your OTP Code</h1>\n" +
                "            </div>\n" +
                "            <div class=\"content\">\n" +
                "                <p>Dear User,</p>\n" +
                "                <p>Your One-Time Password (OTP) for completing the verification process is:</p>\n" +
                "                <div class=\"otp-box\">"+otp+"</div> <!-- Replace with actual OTP -->\n" +
                "                <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>\n" +
                "            </div>\n" +
                "            <div class=\"footer\">\n" +
                "                <p>If you did not request this OTP, please ignore this email.</p>\n" +
                "                <p><a href=\"https://profolio.live\">Team Profolio</a></p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>\n";
    }



}
