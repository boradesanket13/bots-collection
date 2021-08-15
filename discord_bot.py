#python libraries
import discord
import asyncio
import os
import random
import datetime

bot = discord.Client()

@bot.event 
async def on_member_join(member):
    if member.id ==bot.id:
        return
    channel = discord.utils.get(bot.guides[0].channels, name="general")
    response =f"Welcome to the Fitness Centre, {member.name}."
    await channel.send(response)

@bot.event 
async def on_message(message):
    if message.author == bot.user:
        return
    keywords = ["help", "query", "doubt", "question", "problem"]
    channel = message.channel
    for keyword in keywords:
        if keyword.lower() in message.content.lower():
            response = f"Did someone say {keyword.lower()}? Drop your question .Mentors are eager to help you. <@{message.channel}"
            await channel.send(response)

@bot.event 
async def code_reminder():
    while (True):
        await bot.wait_until_ready()
        online_members =[]
        for member in bot.get_all_members():
            if member.status != discord.status.offline and member.id != bot.user.id:
                online_members.append(member.id)
        if len(online_members) > 0:
            user = random.choice(online_members)
            current_time =int(datetime.datetime.now().strftime("%I"))
            channel = discord.util.get(bot.guilds[0].channels,name ="general")
            message = f"It's {current_time} o'clock! It's time to get your hand on some code <@{user}>!"
            await channel.send(message)
        await asyncio.sleep(3600)

bot.loop.create_task(code_reminder())

token = "#paste bot token here"
bot.run(token)