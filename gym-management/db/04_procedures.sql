-- ============================================
-- Stored Procedures / Functions (PL/pgSQL)
-- ============================================

-- 1. Insert a New Member
DROP PROCEDURE IF EXISTS insert_member(VARCHAR, VARCHAR, VARCHAR, DATE);
CREATE OR REPLACE PROCEDURE insert_member(
    p_member_name VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR,
    p_join_date DATE
)
LANGUAGE plpgsql
AS $$
DECLARE
    next_id INT;
BEGIN
    SELECT COALESCE(MAX(member_id), 0) + 1 INTO next_id FROM Members;
    INSERT INTO Members (member_id, member_name, email, phone, join_date)
    VALUES (next_id, p_member_name, p_email, p_phone, p_join_date);
END;
$$;

-- 2. Update Plan Price
DROP PROCEDURE IF EXISTS update_plan_price(INT, DECIMAL);
CREATE OR REPLACE PROCEDURE update_plan_price(
    p_plan_id INT,
    p_new_price DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Plans SET price = p_new_price WHERE plan_id = p_plan_id;
END;
$$;

-- 3. Display Memberships of a Member
DROP FUNCTION IF EXISTS get_member_memberships(INT);
CREATE OR REPLACE FUNCTION get_member_memberships(p_member_id INT)
RETURNS TABLE (
    membership_id INT,
    plan_name VARCHAR,
    start_date DATE,
    end_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT ms.membership_id, p.plan_name, ms.start_date, ms.end_date
    FROM Memberships ms
    JOIN Plans p ON ms.plan_id = p.plan_id
    WHERE ms.member_id = p_member_id;
END;
$$;

-- 4. Calculate Total Revenue
DROP FUNCTION IF EXISTS calculate_total_revenue();
CREATE OR REPLACE FUNCTION calculate_total_revenue()
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
    total DECIMAL;
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO total FROM Payments WHERE status = 'Completed';
    RETURN total;
END;
$$;

-- 5. List Members of a Plan
DROP FUNCTION IF EXISTS list_plan_members(INT);
CREATE OR REPLACE FUNCTION list_plan_members(p_plan_id INT)
RETURNS TABLE (
    member_id INT,
    member_name VARCHAR,
    email VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT m.member_id, m.member_name, m.email
    FROM Members m
    JOIN Memberships ms ON m.member_id = ms.member_id
    WHERE ms.plan_id = p_plan_id;
END;
$$;
