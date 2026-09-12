-- ============================================
-- Gym Membership Management System - Schema
-- ============================================

DROP TABLE IF EXISTS TrainerAssignments CASCADE;
DROP TABLE IF EXISTS Payments CASCADE;
DROP TABLE IF EXISTS Memberships CASCADE;
DROP TABLE IF EXISTS Plans CASCADE;
DROP TABLE IF EXISTS Trainers CASCADE;
DROP TABLE IF EXISTS Members CASCADE;

CREATE TABLE Members (
    member_id INT PRIMARY KEY,
    member_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    join_date DATE
);

CREATE TABLE Trainers (
    trainer_id INT PRIMARY KEY,
    trainer_name VARCHAR(100),
    specialization VARCHAR(100),
    phone VARCHAR(15)
);

CREATE TABLE Plans (
    plan_id INT PRIMARY KEY,
    plan_name VARCHAR(100),
    duration INT,
    price DECIMAL(10,2)
);

CREATE TABLE Memberships (
    membership_id INT PRIMARY KEY,
    member_id INT,
    plan_id INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (member_id) REFERENCES Members(member_id),
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id)
);

CREATE TABLE Payments (
    payment_id INT PRIMARY KEY,
    member_id INT,
    amount DECIMAL(10,2),
    payment_date DATE,
    status VARCHAR(20),
    FOREIGN KEY (member_id) REFERENCES Members(member_id)
);

-- EXTENSION (not in original spec): links Trainers <-> Members so that
-- "trainer with assigned members" and "trainer performance report" are possible.
CREATE TABLE TrainerAssignments (
    assignment_id SERIAL PRIMARY KEY,
    trainer_id INT REFERENCES Trainers(trainer_id),
    member_id INT REFERENCES Members(member_id)
);
