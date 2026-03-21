const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

export interface DiscordFileResult {
  url: string;
  attachmentId: string;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadWithRetry(
  buffer: Buffer,
  fileName: string,
  retries = 3
): Promise<DiscordFileResult> {
  if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
    throw new Error("Discord not configured");
  }

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(buffer)]), fileName);
  formData.append("payload_json", JSON.stringify({
    content: `File: ${fileName}`
  }));

  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      const attachment = data.attachments?.[0];
      if (attachment) {
        return {
          url: attachment.url,
          attachmentId: attachment.id,
        };
      }
    }

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "5", 10);
      console.log(`Rate limited, retrying after ${retryAfter}s...`);
      await sleep(retryAfter * 1000);
      continue;
    }

    if (attempt < retries - 1) {
      await sleep(2000 * (attempt + 1));
      continue;
    }

    const error = await response.text();
    console.log("Discord upload error:", error);
    throw new Error(`Discord upload failed: ${response.status}`);
  }

  throw new Error("Discord upload failed after retries");
}

export async function uploadToDiscord(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<DiscordFileResult | null> {
  return uploadWithRetry(buffer, fileName);
}

export async function deleteFromDiscord(attachmentId: string): Promise<void> {
  console.log("Discord file deletion not implemented - attachment:", attachmentId);
}
