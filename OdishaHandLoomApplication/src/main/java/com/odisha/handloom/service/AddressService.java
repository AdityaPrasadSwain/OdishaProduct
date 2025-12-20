package com.odisha.handloom.service;

import com.odisha.handloom.entity.Address;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.AddressRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Address> getAddressesForUser(UUID userId) {
        return addressRepository.findByUserId(userId);
    }

    @Transactional
    public Address addAddress(UUID userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        address.setUser(user);

        // If this is the first address, make it default
        List<Address> existingAddresses = addressRepository.findByUserId(userId);
        if (existingAddresses.isEmpty()) {
            address.setDefault(true);
        } else if (address.isDefault()) {
            // If new address is set as default, unset others
            existingAddresses.forEach(a -> {
                if (a.isDefault()) {
                    a.setDefault(false);
                    addressRepository.save(a);
                }
            });
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void setDefaultAddress(UUID userId, UUID addressId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        for (Address address : addresses) {
            if (address.getId().equals(addressId)) {
                address.setDefault(true);
            } else if (address.isDefault()) {
                address.setDefault(false);
            }
        }
        addressRepository.saveAll(addresses);
    }

    public Address getAddressById(UUID addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
    }
}
