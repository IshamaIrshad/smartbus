
package com.smartbus.backend.dto;

public class StaffResponse {

    private Integer userId;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private String role;
    private String employeeId;
    private String licenseNo;
    private String status;

    public StaffResponse() {
    }

    public StaffResponse(
            Integer userId,
            String name,
            String email,
            String phone,
            String gender,
            String role,
            String employeeId,
            String licenseNo,
            String status) {

        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.role = role;
        this.employeeId = employeeId;
        this.licenseNo = licenseNo;
        this.status = status;
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getLicenseNo() { return licenseNo; }
    public void setLicenseNo(String licenseNo) { this.licenseNo = licenseNo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}