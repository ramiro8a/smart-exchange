package com.qhatuna.exchange.domain.provider.sunat.templates;

import com.qhatuna.exchange.commons.utils.Util;

import java.time.LocalDate;
import java.time.LocalTime;

public final class Invoice {
    public static String getFirmaDigital(String id, String certificado){
        return String.format(FIRMA_DIGITAL, id, certificado);
    }
    private static final String FIRMA_DIGITAL = """
              <ext:UBLExtensions>
                <ext:UBLExtension>
                  <ext:ExtensionContent>
                      <ds:Signature Id="%s">
                        <ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
                        <ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
                        <ds:Reference URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><ds:DigestValue>6Oqjr+N0kkOBvij5amLGdrMdih4=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>xr04IXVnGLByt5CPsqD6DYeSrGzkds7y5PEvH7FMXiC3gi4/TJfPNo8xsYMS6UJBNE00MnfSEU8HAEIzp7TUwmtJpDyR7Iv40YPuIGXdwBCRSoEKEm0imSKc8+j34jUdSW69bp4mWMRXgLfkJQOqWGAq+7vrqQkhW4cTBD6zZaboKpkmorxK22aDQuAY0/X43QeLd8ENVhlIr7B7kTLqbzFdMaITNX9Nys0XAQhstnTJbBj5BS3bbkmsHjcu5OXmkfIwIDcwB3tpRTMHpY3f7srUGaQ19mBipvdYnvI+NzpYmyFoLjx8Ue8h1P7JysFgquyKE2i+cGAFlLIE/LeA1A==</ds:SignatureValue>
                           <ds:KeyInfo><ds:X509Data>
                                <ds:X509Certificate>%s</ds:X509Certificate>
                           </ds:X509Data></ds:KeyInfo>
                      </ds:Signature>
                  </ext:ExtensionContent>
                </ext:UBLExtension>
              </ext:UBLExtensions>
            """;
    public static String getVersiones(){
        return VERSIONES;
    }
    public static final String VERSIONES = """
                      <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
                      <cbc:CustomizationID>2.0</cbc:CustomizationID>
            """;
    public static String getCabecera(String serie, String numero, LocalDate emision, LocalTime emisionHora){
        return String.format(CABECERA,
                serie,
                numero,
                Util.dateAYYYY_MM_DD(emision),
                Util.aHoraMinutoSegundo(emisionHora));
    }
    public static final String CABECERA = """
                        <cbc:ID>%s-%s</cbc:ID>
                        <cbc:IssueDate>%s</cbc:IssueDate>
                        <cbc:IssueTime>%s</cbc:IssueTime>
            """;
    public static String getConfig1(String moneda, String codMoneda){
        return String.format(CONFIG1, moneda, codMoneda);
    }
    public static final String CONFIG1 = """
                          <cbc:InvoiceTypeCode listID="0101">01</cbc:InvoiceTypeCode>
                          <cbc:Note languageLocaleID="1000">%s</cbc:Note>
                          <cbc:DocumentCurrencyCode>%s</cbc:DocumentCurrencyCode>
            """;
    public static String getFirmador(){
        return String.format(FIRMADOR);
    }
    public static final String FIRMADOR = """
              <cac:Signature>
                <cbc:ID>signatureQHATUNA</cbc:ID>
                <cbc:Note>QHATUNA</cbc:Note>
                <cac:SignatoryParty>
                  <cac:PartyIdentification>
                    <cbc:ID>20606430311</cbc:ID>
                  </cac:PartyIdentification>
                  <cac:PartyName>
                    <cbc:Name>QHATUNA</cbc:Name>
                  </cac:PartyName>
                </cac:SignatoryParty>
                <cac:DigitalSignatureAttachment>
                  <cac:ExternalReference>
                    <cbc:URI>#signatureQHATUNA</cbc:URI>
                  </cac:ExternalReference>
                </cac:DigitalSignatureAttachment>
              </cac:Signature>
            """;

    public static String getEmpresa(String ruc, String razonSocial, String ubigeo, String domFiscal,
                                    String departamento, String provincia, String distrito, String direccion,
                                    String telefono, String correo){
        return String.format(EMPRESA, ruc, razonSocial, ubigeo, domFiscal, departamento,
                provincia, distrito, direccion, telefono, correo);
    }
    public static final String EMPRESA = """
                  <cac:AccountingSupplierParty>
                    <cac:Party>
                      <cac:PartyIdentification>
                        <cbc:ID schemeID="6">%s</cbc:ID>
                      </cac:PartyIdentification>
                      <cac:PartyName>
                        <cbc:Name>%s</cbc:Name>
                      </cac:PartyName>
                      <cac:PartyLegalEntity>
                        <cbc:RegistrationName><![CDATA[J &amp; F FADI S.A.C.]]></cbc:RegistrationName>
                        <cac:RegistrationAddress>
                          <cbc:ID>%s</cbc:ID>
                          <cbc:AddressTypeCode>%s</cbc:AddressTypeCode>
                          <cbc:CityName>%s</cbc:CityName>
                          <cbc:CountrySubentity>%s</cbc:CountrySubentity>
                          <cbc:District>%s</cbc:District>
                          <cac:AddressLine>
                            <cbc:Line>%s</cbc:Line>
                          </cac:AddressLine>
                          <cac:Country>
                            <cbc:IdentificationCode>PE</cbc:IdentificationCode>
                          </cac:Country>
                        </cac:RegistrationAddress>
                      </cac:PartyLegalEntity>
                      <cac:Contact>
                        <cbc:Telephone>%s</cbc:Telephone>
                        <cbc:ElectronicMail>%s</cbc:ElectronicMail>
                      </cac:Contact>
                    </cac:Party>
                  </cac:AccountingSupplierParty>
            """;

    public static String getCliente(String tipoDoc, String documento, String razonSocial, String direccion){
        return String.format(CLIENTE, tipoDoc, documento, razonSocial, direccion);
    }
    public static final String CLIENTE = """
              <cac:AccountingCustomerParty>
                <cac:Party>
                  <cac:PartyIdentification>
                    <cbc:ID schemeID="%s">%s</cbc:ID>
                  </cac:PartyIdentification>
                  <cac:PartyLegalEntity>
                    <cbc:RegistrationName>%s</cbc:RegistrationName>
                    <cac:RegistrationAddress>
                      <cac:AddressLine>
                        <cbc:Line>%s</cbc:Line>
                      </cac:AddressLine>
                      <cac:Country>
                        <cbc:IdentificationCode>PE</cbc:IdentificationCode>
                      </cac:Country>
                    </cac:RegistrationAddress>
                  </cac:PartyLegalEntity>
                </cac:Party>
              </cac:AccountingCustomerParty>
            """;


    private Invoice() {}
}
