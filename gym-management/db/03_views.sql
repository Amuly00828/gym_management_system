-- ============================================
-- Views
-- ============================================

DROP VIEW IF EXISTS membership_details_view;
CREATE VIEW membership_details_view AS
SELECT ms.membership_id, m.member_name, p.plan_name, ms.start_date, ms.end_date
FROM Memberships ms
JOIN Members m ON ms.member_id = m.member_id
JOIN Plans p ON ms.plan_id = p.plan_id;

DROP VIEW IF EXISTS payment_summary_view;
CREATE VIEW payment_summary_view AS
SELECT m.member_id, m.member_name, COUNT(pay.payment_id) AS total_payments,
       SUM(pay.amount) AS total_paid
FROM Members m
JOIN Payments pay ON m.member_id = pay.member_id
GROUP BY m.member_id, m.member_name;

DROP VIEW IF EXISTS member_plans_view;
CREATE VIEW member_plans_view AS
SELECT m.member_id, m.member_name, p.plan_name, p.price
FROM Members m
JOIN Memberships ms ON m.member_id = ms.member_id
JOIN Plans p ON ms.plan_id = p.plan_id;

DROP VIEW IF EXISTS trainer_assignments_view;
CREATE VIEW trainer_assignments_view AS
SELECT t.trainer_id, t.trainer_name, t.specialization, m.member_id, m.member_name
FROM Trainers t
JOIN TrainerAssignments ta ON t.trainer_id = ta.trainer_id
JOIN Members m ON ta.member_id = m.member_id;

DROP VIEW IF EXISTS active_memberships_view;
CREATE VIEW active_memberships_view AS
SELECT ms.membership_id, m.member_name, p.plan_name, ms.start_date, ms.end_date
FROM Memberships ms
JOIN Members m ON ms.member_id = m.member_id
JOIN Plans p ON ms.plan_id = p.plan_id
WHERE ms.end_date >= CURRENT_DATE;
