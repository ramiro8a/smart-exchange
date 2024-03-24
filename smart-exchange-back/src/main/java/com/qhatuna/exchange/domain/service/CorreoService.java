package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.utils.Util;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@AllArgsConstructor
@Service
public class CorreoService {

    private final JavaMailSender mailSender;

    public void sendSimpleMessage(String to, String subject, String body) {
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("support@lcexchange.pe");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception ex){
            throw new ProviderException(
                    Util.getExceptionMsg(ex),
                    ErrorMsj.ENVIO_EMAIL.getMsj(),
                    ErrorMsj.ENVIO_EMAIL.getCod()
            );
        }
    }

    public void sendSimpleMessageWithAttachment(String to, String subject, String body, String attachmentPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("support@lcexchange.pe");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            if (attachmentPath != null) {
                FileSystemResource file = new FileSystemResource(new File(attachmentPath));
                if(file.exists()) {
                    helper.addAttachment(file.getFilename(), file);
                } else {
                    throw new ProviderException(
                            "El archivo no existe",
                            ErrorMsj.ENVIO_EMAIL.getMsj(),
                            ErrorMsj.ENVIO_EMAIL.getCod()
                    );
                }
            }

            mailSender.send(message);
        } catch (Exception ex) {
            throw new ProviderException(
                    Util.getExceptionMsg(ex),
                    ErrorMsj.ENVIO_EMAIL.getMsj(),
                    ErrorMsj.ENVIO_EMAIL.getCod()
            );
        }
    }
}
