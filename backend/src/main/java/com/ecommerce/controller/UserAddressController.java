package com.ecommerce.controller;

import com.ecommerce.model.Address;
import com.ecommerce.model.UserAddressMongo;
import com.ecommerce.service.AddressService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-address")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAddressController {

    private final AddressService service;

    public UserAddressController(AddressService service) {
        this.service = service;
    }

    // ✅ ADD a new address for a user
    @PostMapping("/{userId}")
    public UserAddressMongo addAddress(
            @PathVariable Long userId,
            @RequestBody Address address) {

        return service.addAddress(userId, address);
    }

    // ✅ GET all addresses of a user
    @GetMapping("/{userId}")
    public UserAddressMongo getAddresses(@PathVariable Long userId) {
        return service.getAddresses(userId);
    }
}
