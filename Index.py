# index.py
import telebot
from database import presaved_messages

# Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    bot.reply_to(message, "Hello! I'm your presaved message bot. Type any of the preset messages, such as 'hello', 'howareyou', 'bye', or 'python'.")

@bot.message_handler(func=lambda message: True)
def send_presaved_message(message):
    message_text = message.text.lower()
    if message_text in presaved_messages:
        msg_data = presaved_messages[message_text]
        text = msg_data["text"]
        image_url = msg_data["image_url"]
        link_url = msg_data["link_url"]

        if image_url:
            bot.send_photo(message.chat.id, image_url, caption=text)
        elif link_url:
            bot.send_message(message.chat.id, f"{text}\n\n{link_url}")
        else:
            bot.reply_to(message, text)
    else:
        bot.reply_to(message, "Sorry, I don't understand that command.")

if __name__ == "__main__":
    bot.polling()
