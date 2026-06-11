import { Telegraf } from 'telegraf';

// Replace with a valid bot token for a real app.
// If missing, we'll gracefully mock the calls.
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'MOCK_TOKEN';

export const bot = new Telegraf(BOT_TOKEN);

export const ADMIN_GROUP_ID = process.env.TELEGRAM_ADMIN_GROUP_ID || '-1000000000000'; // Mock group ID

export async function sendTelegramNotification(chatId: string, text: string) {
  if (BOT_TOKEN === 'MOCK_TOKEN') {
    console.log(`[MOCK TELEGRAM to ${chatId}] ${text}`);
    return;
  }
  try {
    await bot.telegram.sendMessage(chatId, text, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Telegram send error:', error);
  }
}
