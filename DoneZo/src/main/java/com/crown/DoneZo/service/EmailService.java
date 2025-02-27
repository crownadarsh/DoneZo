package com.crown.DoneZo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    private JavaMailSenderImpl javaMailSender;

    // Correct the property reference to use ${} instead of $()
    @Value("${spring.mail.username}")
    private String fromEmailId;

    public void sendEmail(String recipient, String subject, String body) {

        try {

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);


            // Set sender, recipient, subject, and body
            helper.setFrom(fromEmailId);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(body, true);  // 'true' indicates HTML format

            // Send the email
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Could not send email", e);
        }
    }

}
