const pool = require("./pool");

exports.createMessageQuery = async (title, content, userId) => {
  const queryText = `
    INSERT INTO messages (title, content, author_id, created_at)
    VALUES ($1, $2, $3, NOW())
  `;
  await pool.query(queryText, [title, content, userId]);
};

exports.getAllMessagesWithAuthors = async () => {
  const query = `
    SELECT m.id, m.title, m.content, m.timestamp, m.author_id, u.first_name, u.is_member
    FROM messages m
    JOIN users u ON m.author_id = u.id
    ORDER BY m.created_at DESC
  `;
  try {
    const result = await pool.query(query);
    return result.rows; // This should be an array
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
