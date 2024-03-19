import { db } from "./index.js";

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

    CREATE TABLE IF NOT EXISTS mentions (
      message_id TEXT,
      user_id TEXT,
      mentions_everyone BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (message_id) REFERENCES messages (id),
      FOREIGN KEY (user_id) REFERENCES users (id),
      PRIMARY KEY (message_id, user_id)
    );
    
    CREATE TABLE IF NOT EXISTS role_mentions (
      message_id TEXT,
      role_id TEXT,
      FOREIGN KEY (message_id) REFERENCES messages (id),
      PRIMARY KEY (message_id, role_id)
    );
    
    CREATE TABLE IF NOT EXISTS channel_mentions (
      message_id TEXT,
      channel_id TEXT,
      FOREIGN KEY (message_id) REFERENCES messages (id),
      PRIMARY KEY (message_id, channel_id)
    );
  `);
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

  // Log user mentions with "mentions_everyone" flag
  message.mentions.users.forEach(async (user) => {
    await db.run(
      `
        INSERT INTO mentions (message_id, user_id, mentions_everyone)
        VALUES (?, ?, ?)
        ON CONFLICT(message_id, user_id) DO UPDATE SET mentions_everyone = excluded.mentions_everyone;
      `,
      [message.id, user.id, message.mentions.everyone]
    );
  });

  // Log role mentions
  message.mentions.roles.forEach(async (role) => {
    await db.run(
      `
        INSERT INTO role_mentions (message_id, role_id)
        VALUES (?, ?)
        ON CONFLICT(message_id, role_id) DO NOTHING;
      `,
      [message.id, role.id]
    );
  });

  // Log channel mentions
  message.mentions.channels.forEach(async (channel) => {
    await db.run(
      `
        INSERT INTO channel_mentions (message_id, channel_id)
        VALUES (?, ?)
        ON CONFLICT(message_id, channel_id) DO NOTHING;
      `,
      [message.id, channel.id]
    );
  });
}
