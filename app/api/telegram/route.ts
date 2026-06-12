import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'MOCK_TOKEN');

bot.start((ctx) => {
  const domain = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://ai.studio/build';
  ctx.reply('welcome to SecureAttend! Open the Mini App to check in.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Open Mini App', web_app: { url: domain } }]
      ]
    }
  });
});
bot.help((ctx) => ctx.reply('Send /checkin to check in via location.'));

bot.command('status', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const userList = await db.select().from(users).where(eq(users.telegramId, telegramId));
  if (!userList.length) {
    return ctx.reply("You are not linked. Please link your Telegram ID in the SecureAttend portal.");
  }
  ctx.reply(`Account linked. Role: ${userList[0].role}.`);
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const computedDomain = host ? `${proto}://${host}` : url.origin;

    const domain = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || computedDomain;
    const webhookUrl = `${domain}/api/telegram`;
    
    // Check if the token is available and not a mock token
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token || token === 'MOCK_TOKEN' || token === 'your_bot_token') {
       return NextResponse.json({ ok: false, error: `Telegram bot token is not configured. Please set TELEGRAM_BOT_TOKEN in the settings. Computed webhook: ${webhookUrl}` }, { status: 400 });
    }

    // Set the webhook for the Telegram Bot
    const result = await bot.telegram.setWebhook(webhookUrl);
    
    return NextResponse.json({ ok: true, message: 'Webhook set successfully to ' + webhookUrl, result });
  } catch (error: any) {
    console.error("Webhook setup error:", error);
    return NextResponse.json({ ok: false, error: 'Failed to set webhook: ' + error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram bot error:", error);
    return NextResponse.json({ ok: false, error: 'Failed to process' }, { status: 500 });
  }
}
