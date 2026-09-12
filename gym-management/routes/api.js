const express = require('express');
const router = express.Router();
const pool = require('../db');

// Small helper to run a query and send JSON, with consistent error handling
async function run(res, sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    res.json({ success: true, rows: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/* =========================================================
   BASIC QUERIES
   ========================================================= */

// 1. Display all members
router.get('/basic/members', (req, res) => {
  run(res, 'SELECT * FROM Members ORDER BY member_id');
});

// 2. Show plans with price greater than a value (default 5000)
router.get('/basic/plans-above', (req, res) => {
  const minPrice = req.query.minPrice || 5000;
  run(res, 'SELECT * FROM Plans WHERE price > $1 ORDER BY price', [minPrice]);
});

// 3. List members who joined after a specific date
router.get('/basic/members-joined-after', (req, res) => {
  const date = req.query.date || '2024-01-01';
  run(res, 'SELECT * FROM Members WHERE join_date > $1 ORDER BY join_date', [date]);
});

// 4. Display active memberships (end_date in the future/today)
router.get('/basic/active-memberships', (req, res) => {
  run(res, `SELECT ms.*, m.member_name, p.plan_name
             FROM Memberships ms
             JOIN Members m ON ms.member_id = m.member_id
             JOIN Plans p ON ms.plan_id = p.plan_id
             WHERE ms.end_date >= CURRENT_DATE
             ORDER BY ms.end_date`);
});

// 5. Show trainers with a specific specialization
router.get('/basic/trainers-by-specialization', (req, res) => {
  const spec = req.query.specialization || 'Yoga';
  run(res, 'SELECT * FROM Trainers WHERE specialization ILIKE $1', [spec]);
});

/* =========================================================
   JOINS
   ========================================================= */

// 1. Show member names with their plans
router.get('/joins/member-plans', (req, res) => {
  run(res, `SELECT m.member_name, p.plan_name, p.price
             FROM Members m
             JOIN Memberships ms ON m.member_id = ms.member_id
             JOIN Plans p ON ms.plan_id = p.plan_id
             ORDER BY m.member_name`);
});

// 2. Display trainer with assigned members (uses TrainerAssignments extension)
router.get('/joins/trainer-members', (req, res) => {
  run(res, `SELECT t.trainer_name, t.specialization, m.member_name
             FROM Trainers t
             JOIN TrainerAssignments ta ON t.trainer_id = ta.trainer_id
             JOIN Members m ON ta.member_id = m.member_id
             ORDER BY t.trainer_name`);
});

// 3. Show membership details with member and plan
router.get('/joins/membership-details', (req, res) => {
  run(res, `SELECT ms.membership_id, m.member_name, p.plan_name, ms.start_date, ms.end_date
             FROM Memberships ms
             JOIN Members m ON ms.member_id = m.member_id
             JOIN Plans p ON ms.plan_id = p.plan_id
             ORDER BY ms.membership_id`);
});

// 4. List members with payment details
router.get('/joins/member-payments', (req, res) => {
  run(res, `SELECT m.member_name, pay.amount, pay.payment_date, pay.status
             FROM Members m
             JOIN Payments pay ON m.member_id = pay.member_id
             ORDER BY pay.payment_date`);
});

// 5. Show plan with corresponding members
router.get('/joins/plan-members', (req, res) => {
  run(res, `SELECT p.plan_name, m.member_name
             FROM Plans p
             JOIN Memberships ms ON p.plan_id = ms.plan_id
             JOIN Members m ON ms.member_id = m.member_id
             ORDER BY p.plan_name`);
});

/* =========================================================
   AGGREGATE
   ========================================================= */

// 1. Count total members
router.get('/aggregate/total-members', (req, res) => {
  run(res, 'SELECT COUNT(*) AS total_members FROM Members');
});

// 2. Find average plan price
router.get('/aggregate/average-plan-price', (req, res) => {
  run(res, 'SELECT ROUND(AVG(price), 2) AS average_price FROM Plans');
});

// 3. Calculate total revenue
router.get('/aggregate/total-revenue', (req, res) => {
  run(res, "SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM Payments WHERE status = 'Completed'");
});

// 4. Find highest plan price
router.get('/aggregate/highest-plan-price', (req, res) => {
  run(res, 'SELECT * FROM Plans ORDER BY price DESC LIMIT 1');
});

// 5. Count members per plan
router.get('/aggregate/members-per-plan', (req, res) => {
  run(res, `SELECT p.plan_name, COUNT(ms.member_id) AS member_count
             FROM Plans p
             LEFT JOIN Memberships ms ON p.plan_id = ms.plan_id
             GROUP BY p.plan_name
             ORDER BY member_count DESC`);
});

/* =========================================================
   SUBQUERIES
   ========================================================= */

// 1. Find members without memberships
router.get('/subqueries/members-without-memberships', (req, res) => {
  run(res, `SELECT * FROM Members
             WHERE member_id NOT IN (SELECT member_id FROM Memberships WHERE member_id IS NOT NULL)`);
});

// 2. Show plans above average price
router.get('/subqueries/plans-above-average', (req, res) => {
  run(res, `SELECT * FROM Plans WHERE price > (SELECT AVG(price) FROM Plans) ORDER BY price DESC`);
});

// 3. Find members with highest spending
router.get('/subqueries/highest-spending-member', (req, res) => {
  run(res, `SELECT m.member_name, SUM(pay.amount) AS total_spent
             FROM Members m
             JOIN Payments pay ON m.member_id = pay.member_id
             GROUP BY m.member_name
             HAVING SUM(pay.amount) = (
               SELECT MAX(total) FROM (
                 SELECT SUM(amount) AS total FROM Payments GROUP BY member_id
               ) sub
             )`);
});

// 4. Find plans with minimum price
router.get('/subqueries/plans-min-price', (req, res) => {
  run(res, `SELECT * FROM Plans WHERE price = (SELECT MIN(price) FROM Plans)`);
});

// 5. Show members whose spending is above average
router.get('/subqueries/members-above-average-spending', (req, res) => {
  run(res, `SELECT m.member_name, SUM(pay.amount) AS total_spent
             FROM Members m
             JOIN Payments pay ON m.member_id = pay.member_id
             GROUP BY m.member_name
             HAVING SUM(pay.amount) > (
               SELECT AVG(total) FROM (
                 SELECT SUM(amount) AS total FROM Payments GROUP BY member_id
               ) sub
             )`);
});

/* =========================================================
   UPDATES & DELETES
   ========================================================= */

// 1. Update plan price
router.put('/updates/plan-price', async (req, res) => {
  const { plan_id, new_price } = req.body;
  try {
    await pool.query('CALL update_plan_price($1, $2)', [plan_id, new_price]);
    res.json({ success: true, message: `Plan ${plan_id} price updated to ${new_price}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Change member email
router.put('/updates/member-email', async (req, res) => {
  const { member_id, email } = req.body;
  try {
    await pool.query('UPDATE Members SET email = $1 WHERE member_id = $2', [email, member_id]);
    res.json({ success: true, message: `Member ${member_id} email updated` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Delete inactive members (no membership with a future end_date)
router.delete('/updates/inactive-members', async (req, res) => {
  try {
    const result = await pool.query(`
      DELETE FROM Members
      WHERE member_id NOT IN (
        SELECT member_id FROM Memberships WHERE end_date >= CURRENT_DATE
      )
      RETURNING *`);
    res.json({ success: true, deleted: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Update trainer details
router.put('/updates/trainer-details', async (req, res) => {
  const { trainer_id, trainer_name, specialization, phone } = req.body;
  try {
    await pool.query(
      `UPDATE Trainers SET trainer_name = COALESCE($2, trainer_name),
       specialization = COALESCE($3, specialization),
       phone = COALESCE($4, phone)
       WHERE trainer_id = $1`,
      [trainer_id, trainer_name, specialization, phone]
    );
    res.json({ success: true, message: `Trainer ${trainer_id} updated` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Delete memberships with expired plans
router.delete('/updates/expired-memberships', async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM Memberships WHERE end_date < CURRENT_DATE RETURNING *`
    );
    res.json({ success: true, deleted: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================
   VIEWS
   ========================================================= */

router.get('/views/membership-details', (req, res) => {
  run(res, 'SELECT * FROM membership_details_view ORDER BY membership_id');
});

router.get('/views/payment-summary', (req, res) => {
  run(res, 'SELECT * FROM payment_summary_view ORDER BY total_paid DESC');
});

router.get('/views/member-plans', (req, res) => {
  run(res, 'SELECT * FROM member_plans_view ORDER BY member_name');
});

router.get('/views/trainer-assignments', (req, res) => {
  run(res, 'SELECT * FROM trainer_assignments_view ORDER BY trainer_name');
});

router.get('/views/active-memberships', (req, res) => {
  run(res, 'SELECT * FROM active_memberships_view ORDER BY end_date');
});

/* =========================================================
   STORED PROCEDURES
   ========================================================= */

// 1. Insert a new member
router.post('/procedures/insert-member', async (req, res) => {
  const { member_name, email, phone, join_date } = req.body;
  try {
    await pool.query('CALL insert_member($1, $2, $3, $4)', [member_name, email, phone, join_date]);
    res.json({ success: true, message: 'Member inserted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Update plan price (procedure)
router.post('/procedures/update-plan-price', async (req, res) => {
  const { plan_id, new_price } = req.body;
  try {
    await pool.query('CALL update_plan_price($1, $2)', [plan_id, new_price]);
    res.json({ success: true, message: 'Plan price updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Display memberships of a member (function)
router.get('/procedures/member-memberships/:member_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_member_memberships($1)', [req.params.member_id]);
    res.json({ success: true, rows: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Calculate total revenue (function)
router.get('/procedures/total-revenue', async (req, res) => {
  try {
    const result = await pool.query('SELECT calculate_total_revenue() AS total_revenue');
    res.json({ success: true, rows: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. List members of a plan (function)
router.get('/procedures/plan-members/:plan_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM list_plan_members($1)', [req.params.plan_id]);
    res.json({ success: true, rows: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================
   REPORTS / ANALYSIS
   ========================================================= */

// Top 5 most popular plans
router.get('/reports/top-plans', (req, res) => {
  run(res, `SELECT p.plan_name, COUNT(ms.membership_id) AS subscribers
             FROM Plans p
             LEFT JOIN Memberships ms ON p.plan_id = ms.plan_id
             GROUP BY p.plan_name
             ORDER BY subscribers DESC
             LIMIT 5`);
});

// Most active members (most payments made)
router.get('/reports/most-active-members', (req, res) => {
  run(res, `SELECT m.member_name, COUNT(pay.payment_id) AS payment_count
             FROM Members m
             JOIN Payments pay ON m.member_id = pay.member_id
             GROUP BY m.member_name
             ORDER BY payment_count DESC
             LIMIT 5`);
});

// Monthly revenue report
router.get('/reports/monthly-revenue', (req, res) => {
  run(res, `SELECT TO_CHAR(payment_date, 'YYYY-MM') AS month, SUM(amount) AS revenue
             FROM Payments
             WHERE status = 'Completed'
             GROUP BY TO_CHAR(payment_date, 'YYYY-MM')
             ORDER BY month`);
});

// Plan generating highest revenue
router.get('/reports/highest-revenue-plan', (req, res) => {
  run(res, `SELECT p.plan_name, SUM(pay.amount) AS revenue
             FROM Plans p
             JOIN Memberships ms ON p.plan_id = ms.plan_id
             JOIN Payments pay ON pay.member_id = ms.member_id
             GROUP BY p.plan_name
             ORDER BY revenue DESC
             LIMIT 1`);
});

// Member spending analysis
router.get('/reports/member-spending', (req, res) => {
  run(res, `SELECT m.member_name, SUM(pay.amount) AS total_spent, COUNT(pay.payment_id) AS payments_made
             FROM Members m
             JOIN Payments pay ON m.member_id = pay.member_id
             GROUP BY m.member_name
             ORDER BY total_spent DESC`);
});

// Trainer performance report (number of assigned members)
router.get('/reports/trainer-performance', (req, res) => {
  run(res, `SELECT t.trainer_name, t.specialization, COUNT(ta.member_id) AS members_assigned
             FROM Trainers t
             LEFT JOIN TrainerAssignments ta ON t.trainer_id = ta.trainer_id
             GROUP BY t.trainer_name, t.specialization
             ORDER BY members_assigned DESC`);
});

module.exports = router;
