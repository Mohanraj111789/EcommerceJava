package com.ecommerce.service;

import com.ecommerce.model.Address;
import com.ecommerce.model.UserAddressMongo;
import com.ecommerce.repository.UserAddressMongoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AddressService {

    private final UserAddressMongoRepository repo;

    public AddressService(UserAddressMongoRepository repo) {
        this.repo = repo;
    }

    // ✅ Add new address for a user (append to list)
    public UserAddressMongo addAddress(Long userId, Address address) {

        address.setAddressId(UUID.randomUUID().toString()); // unique id

        UserAddressMongo userAddress = repo.findByUserId(userId)
                .orElseGet(() -> {
                    UserAddressMongo ua = new UserAddressMongo();
                    ua.setUserId(userId);
                    return ua;
                });

        if (userAddress.getAddresses() == null) {
            userAddress.setAddresses(List.of(address));
        } else {
            userAddress.getAddresses().add(address);
        }

        return repo.save(userAddress);
    }

    // ✅ Get all addresses of a user
    public UserAddressMongo getAddresses(Long userId) {
        return repo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No addresses found for userId: " + userId));
    }
}
