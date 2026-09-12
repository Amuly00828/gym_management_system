-- ============================================
-- Sample Data
-- ============================================

INSERT INTO Members (member_id, member_name, email, phone, join_date) VALUES
(1, 'Arjun Reddy', 'arjun.reddy@example.com', '9000000001', '2024-01-15'),
(2, 'Priya Sharma', 'priya.sharma@example.com', '9000000002', '2024-02-10'),
(3, 'Karthik Rao', 'karthik.rao@example.com', '9000000003', '2024-03-05'),
(4, 'Sneha Patel', 'sneha.patel@example.com', '9000000004', '2024-04-20'),
(5, 'Vikram Singh', 'vikram.singh@example.com', '9000000005', '2024-05-12'),
(6, 'Ananya Iyer', 'ananya.iyer@example.com', '9000000006', '2024-06-01'),
(7, 'Rahul Verma', 'rahul.verma@example.com', '9000000007', '2024-07-18'),
(8, 'Divya Nair', 'divya.nair@example.com', '9000000008', '2024-08-22');

INSERT INTO Trainers (trainer_id, trainer_name, specialization, phone) VALUES
(1, 'Coach Ramesh', 'Strength Training', '9111100001'),
(2, 'Coach Meena', 'Yoga', '9111100002'),
(3, 'Coach Suresh', 'Cardio', '9111100003'),
(4, 'Coach Lakshmi', 'CrossFit', '9111100004');

INSERT INTO Plans (plan_id, plan_name, duration, price) VALUES
(1, 'Basic Monthly', 1, 1500.00),
(2, 'Quarterly', 3, 4200.00),
(3, 'Half Yearly', 6, 7800.00),
(4, 'Annual', 12, 14400.00),
(5, 'Premium Annual', 12, 22000.00);

INSERT INTO Memberships (membership_id, member_id, plan_id, start_date, end_date) VALUES
(1, 1, 4, '2024-01-15', '2025-01-15'),
(2, 2, 2, '2024-02-10', '2024-05-10'),
(3, 3, 1, '2024-03-05', '2024-04-05'),
(4, 4, 5, '2024-04-20', '2025-04-20'),
(5, 5, 3, '2024-05-12', '2024-11-12'),
(6, 6, 1, '2024-06-01', '2024-07-01'),
(7, 7, 4, '2024-07-18', '2025-07-18'),
(8, 8, 2, '2024-08-22', '2024-11-22');

INSERT INTO Payments (payment_id, member_id, amount, payment_date, status) VALUES
(1, 1, 14400.00, '2024-01-15', 'Completed'),
(2, 2, 4200.00, '2024-02-10', 'Completed'),
(3, 3, 1500.00, '2024-03-05', 'Completed'),
(4, 4, 22000.00, '2024-04-20', 'Completed'),
(5, 5, 7800.00, '2024-05-12', 'Completed'),
(6, 6, 1500.00, '2024-06-01', 'Pending'),
(7, 7, 14400.00, '2024-07-18', 'Completed'),
(8, 8, 4200.00, '2024-08-22', 'Completed');

INSERT INTO TrainerAssignments (trainer_id, member_id) VALUES
(1, 1), (1, 7), (2, 2), (2, 6), (3, 3), (3, 8), (4, 4), (4, 5);
