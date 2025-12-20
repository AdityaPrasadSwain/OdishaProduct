package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Address;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(addressService.getAddressesForUser(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Address address) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(addressService.addAddress(user.getId(), address));
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        addressService.setDefaultAddress(user.getId(), id);
        return ResponseEntity.ok().build();
    }
}
