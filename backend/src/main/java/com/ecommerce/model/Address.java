package com.ecommerce.model;

public class Address {

    private String addressId;   // each address unique
    private String type;        // home / office
    private String doorNo;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String phone;

    public Address() {}

    // getters and setters
    public String getAddressId() { return addressId; }
    public void setAddressId(String addressId) { this.addressId = addressId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDoorNo() { return doorNo; }
    public void setDoorNo(String doorNo) { this.doorNo = doorNo; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
