package com.smartbus.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conductor_assignments")
public class ConductorAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conductor_assignment_id")
    private Integer conductorAssignmentId;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "conductor_id", nullable = false)
    private Conductor conductor;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    // Default constructor
    public ConductorAssignment() {
    }

    // Getters and Setters

    public Integer getConductorAssignmentId() {
        return conductorAssignmentId;
    }

    public void setConductorAssignmentId(Integer conductorAssignmentId) {
        this.conductorAssignmentId = conductorAssignmentId;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public Conductor getConductor() {
        return conductor;
    }

    public void setConductor(Conductor conductor) {
        this.conductor = conductor;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
}