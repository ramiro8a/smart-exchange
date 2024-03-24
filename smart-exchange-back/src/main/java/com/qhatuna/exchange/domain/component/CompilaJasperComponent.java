package com.qhatuna.exchange.domain.component;

import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import net.sf.jasperreports.engine.DefaultJasperReportsContext;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.ExporterInput;
import net.sf.jasperreports.export.OutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Map;

@Component
public class CompilaJasperComponent {
    public byte[] buildDocument(Map<String, Object> map, String jasperFile) throws ProviderException{
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()){
            ClassPathResource resource = new ClassPathResource(jasperFile);
            InputStream ir = resource.getInputStream();
            ExporterInput ei = new SimpleExporterInput(
                    JasperFillManager.fillReport(
                            JasperCompileManager.getInstance(
                                    DefaultJasperReportsContext.getInstance()).compile(ir),
                            map, new JREmptyDataSource()));
            OutputStreamExporterOutput eo = new SimpleOutputStreamExporterOutput(os);
            JRPdfExporter exporter = new JRPdfExporter();
            exporter.setExporterInput(ei);
            exporter.setExporterOutput(eo);
            exporter.exportReport();
            return os.toByteArray();
        } catch (Exception e) {
            throw new ProviderException(e.getMessage(), ErrorMsj.JASPER.getMsj(),ErrorMsj.JASPER.getCod());
        }
    }
}
