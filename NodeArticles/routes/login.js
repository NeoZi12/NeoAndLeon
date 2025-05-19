const express = require("express");
const bcrypt = require("bcrypt");
const dbSingleton = require("../dbSingleton");
const router = express.Router();
const db = dbSingleton.getConnection();

router.post("/register", (req, res) => {
  const { first_name, last_name, user_name, password, gender, city, email } =
    req.body;

  // Step 1: Query for existing emails
  const userEmailsQuery = `SELECT email FROM users WHERE email = ?`;

  db.query(userEmailsQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking existing email:", err);
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Step 2: Hash the password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error("Error generating salt:", err);
        return res.status(500).json({ error: "Error generating salt." });
      }

      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: "Error hashing password." });
        }

        // Step 3: Insert new user
        const insertQuery = `
          INSERT INTO users (first_name, last_name, user_name, password, gender, city, email)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          first_name,
          last_name,
          user_name,
          hashedPassword,
          gender,
          city,
          email,
        ];

        db.query(insertQuery, values, (err, results) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ error: "Database error." });
          }

          res.status(201).json({ message: "User registered successfully." });
        });
      }); // <-- סוגר של bcrypt.hash
    }); // <-- סוגר של bcrypt.genSalt
  }); // <-- סוגר של db.query
}); // <-- סוגר של router.post

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Email not found." });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Authentication error." });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Success
      res.status(200).json({
        message: "Login successful.",
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          user_name: user.user_name,
          email: user.email,
          city: user.city,
          gender: user.gender,
        },
      });
    });
  });
});

// routes/login.js (או כל קובץ ראוט אחר)
router.get("/cities", (req, res) => {
  const query = "SELECT name_heb FROM yeshuvim";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error getting cities:", err);
      return res.status(500).json({ error: "Database error." });
    }
    res.json(results); // results = [{ name_heb: "חיפה" }, ...]
  });
});

module.exports = router;
