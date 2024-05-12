#!/usr/bin/env python3
# coding: utf-8

#get_ipython().system('pip3 install pandas')

#imports
import pandas as pd
import random
import os
from json import loads, dumps

#path = "/content/drive/MyDrive/WhatsApp_Chat_ex.txt"
path = "sample.txt"
file_name = "sample.txt"

with open(path, 'r') as file :
  data = file.readlines()

# convert to pd.df
df = pd.DataFrame(data, columns=['import'])
# Sampling deactivated
#df = df.sample(n=2000)


#Cleaning Whatsapp Error messages
df = df[~df['import'].str.contains('Your security code')]
df = df[~df['import'].str.contains('Media omitted')]
df = df[~df['import'].str.contains('Messages and calls')]

df.dropna(inplace=True)
df = df[df['import'].str.match(r'^\d')]

# Filter on the part of the file that don't make sense
# To investigate eg Whatsapp info messages
df = df[df['import'].apply(lambda x: len(x.split(" - ", 1))) >= 2]

for index, row in df.iterrows():
  line_split = row['import'].split(" - ", 1)

  date_time = line_split[0]
  message = line_split[1]
  df.at[index, 'date'], df.at[index, 'time'] = date_time.split(", ", 1)
  df.at[index, 'name'], df.at[index, 'message_text'] = message.split(": ", 1)

# Stripping \n and trailing white space
df['message_text'] = df['message_text'].apply(lambda x: x.strip() if isinstance(x, str) else x)
df.drop(columns=['import'])


#Saving
file_name_without_extension = os.path.splitext(file_name)[0]
file_name_without_extension = os.path.splitext(file_name)[0]
output_name = "chat_pp_"+file_name_without_extension
output_name = "output"
#Save to csv locally
#df.to_csv(f"{output_name}.csv", index=True)

#Save into json
result = df.to_json(orient="index")
parsed = loads(result)
print(result)