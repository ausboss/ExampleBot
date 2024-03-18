import { db } from "./index.js";

export async function createChatLogTable() {
  await db.exec(
    "CREATE TABLE IF NOT EXISTS chat_log (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, content TEXT, timestamp INTEGER)"
  );
}
export async function createTables() {
  await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT,
        discriminator TEXT,
        avatar TEXT
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        channel_id TEXT,
        guild_id TEXT,
        created_timestamp INTEGER,
        content TEXT,
        clean_content TEXT,
        author_id TEXT,
        pinned BOOLEAN,
        tts BOOLEAN,
        nonce TEXT,
        FOREIGN KEY (author_id) REFERENCES users (id)
      );
      
      CREATE TABLE IF NOT EXISTS attachments (
        id TEXT PRIMARY KEY,
        message_id TEXT,
        url TEXT,
        name TEXT,
        size INTEGER,
        FOREIGN KEY (message_id) REFERENCES messages (id)
      );
    `);
}

export async function insertChatLog(user, content, timestamp) {
  await db.run(
    "INSERT INTO chat_log (user, content, timestamp) VALUES (?, ?, ?)",
    [user, content, timestamp]
  );
}

export async function logDetailedMessage(message) {
  // User information
  const { id: userId, username, discriminator, avatar } = message.author;

  // Insert user information, avoiding duplicates
  await db.run(
    `
      INSERT INTO users (id, username, discriminator, avatar)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
      username=excluded.username,
      discriminator=excluded.discriminator,
      avatar=excluded.avatar;
    `,
    [userId, username, discriminator, avatar]
  );

  // Message information
  const {
    id: messageId,
    channelId,
    guildId,
    createdTimestamp,
    content,
    cleanContent,
    pinned,
    tts,
    nonce,
  } = message;

  // Insert message information
  await db.run(
    `
      INSERT INTO messages (id, channel_id, guild_id, created_timestamp, content, clean_content, author_id, pinned, tts, nonce)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      messageId,
      channelId,
      guildId,
      createdTimestamp,
      content,
      cleanContent,
      userId,
      pinned,
      tts,
      nonce,
    ]
  );

  // Attachments
  message.attachments.forEach(async (attachment) => {
    const { id: attachmentId, url, name, size } = attachment;

    // Insert attachment information
    await db.run(
      `
        INSERT INTO attachments (id, message_id, url, name, size)
        VALUES (?, ?, ?, ?, ?);
      `,
      [attachmentId, messageId, url, name, size]
    );
  });
}
