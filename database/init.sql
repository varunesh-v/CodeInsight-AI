CREATE DATABASE IF NOT EXISTS codeinsight_ai;

USE codeinsight_ai;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- QUESTIONS
-- =========================
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    question_text LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SUBMISSIONS
-- =========================
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    submitted_code LONGTEXT NOT NULL,
    score FLOAT DEFAULT 0,
    feedback LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_submission_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_submission_question
        FOREIGN KEY (question_id)
        REFERENCES questions(id)
        ON DELETE CASCADE
);

-- =========================
-- EVALUATIONS
-- =========================
CREATE TABLE IF NOT EXISTS evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    ai_score FLOAT NOT NULL,
    ai_feedback LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evaluation_submission
        FOREIGN KEY (submission_id)
        REFERENCES submissions(id)
        ON DELETE CASCADE
);

-- =========================
-- SAMPLE USER
-- Password: Password123
-- Replace with actual bcrypt hash if needed
-- =========================

INSERT IGNORE INTO users (
    id,
    email,
    password
)
VALUES (
    1,
    'test@example.com',
    '$2b$12$DnDxqZ7zoRBATHtwmee9num9K6Gnqy5CXetLRyB.BKX.oGbrntDXm'
);