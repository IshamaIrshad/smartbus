package com.smartbus.backend.dto;

public class PassengerProfileRequest {

    private String nic;
    private String dateOfBirth;
    private String address;

    public PassengerProfileRequest() {
    }

    public PassengerProfileRequest(
            String nic,
            String dateOfBirth,
            String address) {

        this.nic = nic;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}