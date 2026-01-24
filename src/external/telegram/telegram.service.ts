import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';

@Injectable()
export class TelegramService {
  private sentimentTopicMap = {
    good: Number(process.env.TELEGRAM_TOPIC_ID_GOOD_NEWS),
    neutral: Number(process.env.TELEGRAM_TOPIC_ID_NEYRTAL_NEWS),
    bad: Number(process.env.TELEGRAM_TOPIC_ID_BAD_NEWS),
    // bad: Number(process.env.TELEGRAM_TOPIC_ID_BAD_NEWS),
  };

  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
    this.setupBot();
  }

  private setupBot() {
    // /start komandasi
    this.bot.start((ctx) => {
      ctx.reply(`Bot ishga tushdi! 🚀\n\nChat ID: ${ctx.chat.id}`);
    });

    // Har qanday text xabarni tinglaydi
    this.bot.on('text', (ctx) => {
      ctx.reply(
        `Qabul qildim 👌\n\nChat ID: ${ctx.chat.id}\nXabar: ${ctx.message.text}`
      );
    });
  }

  async sendToGroup(
    text: string,
    topicId?: number,
    options: { parseMode?: 'HTML' | 'Markdown' } = {}
  ) {
    try {
      const chatId = process.env.TELEGRAM_GROUP_ID || '@news_day_scrapping';
      const topicId = Number(process.env.TELEGRAM_GROUP_MESSAGES);
      if (!chatId) {
        // this.logger.error('TELEGRAM_CHAT_ID topilmadi!');
        return;
      }

      const result = await this.bot.telegram.sendMessage(chatId, text, {
        parse_mode: options.parseMode || 'HTML',
        message_thread_id: topicId,
      });
      return result;
    } catch (error) {
      // this.logger.error('Guruhga xabar yuborishda xato:', error);
      throw new Error('Telegram guruhga xabar yuborilmadi');
    }
  }
  getTopicIdBySentiment(sentiment: 'good' | 'neutral' | 'bad'): number {
    return this.sentimentTopicMap[sentiment];
  }
}
