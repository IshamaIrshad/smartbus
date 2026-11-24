package com.smartbus.backend.dto;

public class ConductorProfileResponse {

    private Integer userId;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private String employeeId;
    private String licenseNo;

    public ConductorProfileResponse() {
    }

    public ConductorProfileResponse(
            Integer userId,
            String name,
            String email,
            String phone,
            String gender,
            String employeeId,
            String licenseNo) {

        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.employeeId = employeeId;
        this.licenseNo = licenseNo;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getLicenseNo() {
        return licenseNo;
    }

    public void setLicenseNo(String licenseNo) {
        this.licenseNo = licenseNo;
    }
}