package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "user_addresses")
public class UserAddressMongo {

    @Id
    private String id;      // Mongo internal id

    private Long userId;    // <-- LINK TO POSTGRES USER ID

    private List<Address> addresses;

    public UserAddressMongo() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<Address> getAddresses() { return addresses; }
    public void setAddresses(List<Address> addresses) { this.addresses = addresses; }
}
