CREATE TABLE chat_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedback_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id CHAR(36),
    feedback VARCHAR(20)
);




