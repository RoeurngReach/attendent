import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'MOCK_TOKEN');

bot.start((ctx) => ctx.reply('សួស្តី! Welcome to SecureAttend Bot. Please authenticate by sharing your ID.'));
bot.help((ctx) => ctx.reply('Send /checkin to check in via location.'));

bot.command('status', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const userList = await db.select().from(users).where(eq(users.telegramId, telegramId));
  if (!userList.length) {
    return ctx.reply("You are not linked. Please link your Telegram ID in the SecureAttend portal.");
  }
  ctx.reply(`Account linked. Role: ${userList[0].role}.`);
});

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
