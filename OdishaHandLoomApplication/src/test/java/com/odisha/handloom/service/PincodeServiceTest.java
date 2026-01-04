package com.odisha.handloom.service;

import com.odisha.handloom.dto.PincodeResponse;
import com.odisha.handloom.service.PincodeService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

@ExtendWith(MockitoExtension.class)
public class PincodeServiceTest {

    @Mock
    private RestClient restClient;

    @Test
    public void testInvalidPincodeFormat() {
        PincodeService service = new PincodeService(restClient);
        PincodeResponse response = service.fetchPincodeDetails("123");
        Assertions.assertFalse(response.isValid());
    }

    @Test
    public void testNonNumericPincode() {
        PincodeService service = new PincodeService(restClient);
        PincodeResponse response = service.fetchPincodeDetails("abcdef");
        Assertions.assertFalse(response.isValid());
    }
}
