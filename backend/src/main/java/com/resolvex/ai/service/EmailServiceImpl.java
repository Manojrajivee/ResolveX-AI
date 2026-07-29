package com.resolvex.ai.service;

import com.resolvex.ai.config.EmailConfig;
import com.resolvex.ai.dto.EmailRequest;
import com.resolvex.ai.exception.EmailException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final EmailConfig emailConfig;
    private final JavaMailSender mailSender;

    public EmailServiceImpl(EmailConfig emailConfig, JavaMailSender mailSender) {
        this.emailConfig = emailConfig;
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(EmailRequest request) {
        if (emailConfig.getHost() == null || emailConfig.getHost().isBlank()) {
            System.out.println("====== [OFFLINE MOCK EMAIL] ======");
            System.out.println("To: " + request.getTo());
            System.out.println("Subject: " + request.getSubject());
            System.out.println("Body: " + request.getBody());
            System.out.println("==================================");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            String fromAddress = (emailConfig.getUsername() != null && !emailConfig.getUsername().isBlank()) 
                    ? emailConfig.getUsername() 
                    : "noreply@resolvex.ai";
            
            helper.setFrom(fromAddress);
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(request.getBody(), true); // Send as HTML mail
            
            mailSender.send(message);
            System.out.println("SMTP Client: Routed SMTP mail payload to " + emailConfig.getHost() + ":" + emailConfig.getPort() + " for recipient: " + request.getTo());
        } catch (Exception ex) {
            throw new EmailException("Failed to dispatch HTML email payload: " + ex.getMessage());
        }
    }
}
