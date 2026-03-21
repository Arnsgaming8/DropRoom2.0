const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

export interface DiscordFileResult {
  url: string;
  attachmentId: string;
}

export async function uploadToDiscord(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<DiscordFileResult | null> {
  if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
    console.log("Discord not configured - missing token or channel ID");
    throw new Error("Discord not configured");
  }

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(buffer)]), fileName);
  formData.append("payload_json", JSON.stringify({
    content: `File: ${fileName}`
  }));

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

  if (!response.ok) {
    const error = await response.text();
    console.log("Discord upload error:", error);
    throw new Error(`Discord upload failed: ${response.status}`);
  }

  const data = await response.json();
  const attachment = data.attachments?.[0];

  if (!attachment) {
    throw new Error("No attachment in Discord response");
  }

  return {
    url: attachment.url,
    attachmentId: attachment.id,
  };
}

export async function deleteFromDiscord(attachmentId: string): Promise<void> {
  console.log("Discord file deletion not implemented - attachment:", attachmentId);
}
