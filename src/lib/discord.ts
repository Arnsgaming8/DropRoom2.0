import { Client, GatewayIntentBits, ChannelType, AttachmentBuilder } from "discord.js";

let discordClient: Client | null = null;
let channel: any = null;

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

async function getDiscordChannel() {
  if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
    console.log("Discord not configured - missing token or channel ID");
    return null;
  }

  if (!discordClient) {
    discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ],
    });

    await discordClient.login(DISCORD_BOT_TOKEN);
    console.log("Discord client logged in");
  }

  if (!channel) {
    const ch = await discordClient.channels.fetch(DISCORD_CHANNEL_ID);
    if (ch && (ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildAnnouncement)) {
      channel = ch;
      console.log("Discord channel connected");
    }
  }

  return channel;
}

export interface DiscordFileResult {
  url: string;
  attachmentId: string;
}

export async function uploadToDiscord(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<DiscordFileResult | null> {
  const discordChannel = await getDiscordChannel();
  
  if (!discordChannel) {
    throw new Error("Discord not configured");
  }

  const attachment = new AttachmentBuilder(buffer, { name: fileName });
  
  const message = await discordChannel.send({
    files: [attachment],
  });

  const attachedFile = message.attachments.first();
  
  if (!attachedFile) {
    throw new Error("Failed to upload file to Discord");
  }

  return {
    url: attachedFile.url,
    attachmentId: attachedFile.id,
  };
}

export async function deleteFromDiscord(attachmentId: string): Promise<void> {
  console.log("Discord file deletion - attachment:", attachmentId);
}
