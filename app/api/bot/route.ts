import { NextResponse } from 'next/server';
import { bot } from '@/lib/bot';
import { globalDb } from '@/lib/db';

const MINI_APP_URL = 'https://ai.studio/build'; // This would be the real app url

bot.start((ctx) => {
  ctx.reply('Welcome to SecureAttend! Open the Mini App to check in.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Open Mini App', web_app: { url: MINI_APP_URL } }]
      ]
    }
  });
});

bot.command('link', (ctx) => {
  const code = ctx.message.text.split(' ')[1];
  if (!code) {
    return ctx.reply('Usage: /link <EmployeeID>');
  }

  const employee = globalDb[code.toUpperCase()];
  if (!employee) {
    return ctx.reply('Invalid Employee ID.');
  }

  employee.telegram_id = ctx.from.id.toString();
  ctx.reply(`Successfully linked your Telegram account to ${employee.name} (${code.toUpperCase()}).`);
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Bot Error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
