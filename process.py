import numpy as np
import pandas as pd

csv_path = "chat_pp_sample.csv"
df = pd.read_csv(csv_path, index_col=0)
df.drop(columns=['import'], inplace=True)

from textblob import TextBlob

token=['love','I miss you', 'baby', 'babe','honey','I love you', 'darling','soulmate']

# Token find
token_index=dict()
for tok in token:
    token_index[tok]=(df[df['message_text'].str.contains(tok)].index.tolist())


for index, row in df.iterrows():
    blob=TextBlob(row['message_text'])
    polarity =blob.sentiment.polarity
    subjectivity =blob.sentiment.subjectivity

    #print(polarity, subjectivity)
    df.at[index, 'polarity']=polarity
    df.at[index, 'subjectivity']=subjectivity


polarity_df = df.sort_values(by=['polarity'], ascending=False).head(5)
subjectivyty_df = df.sort_values(by=['subjectivity'], ascending=False).head(5)

### Converseraiton
time_gap_threshold = pd.Timedelta(minutes=30)
df['Timestamp'] = pd.to_datetime(df['date'] + ' ' + df['time'], format='mixed')

session_id = 0
session_start_time = df.iloc[0]['Timestamp']
df['Session'] = None
for index, row in df.iterrows():
    if row['Timestamp'] - session_start_time > time_gap_threshold:
            session_id += 1
            session_start_time = row['Timestamp']
            df.at[index, 'Session'] = session_id
    df.at[index, 'Session'] = session_id

for session_id, session_group in df.groupby('Session'):
    corpus = ' '.join(session_group['message_text'])
    blob = TextBlob(corpus)
    polarity =blob.sentiment.polarity
    subjectivity =blob.sentiment.subjectivity    

    counter = 0
    token_counts = {}
    for tok in token:
        if (tok in corpus):
            counter += 1
#        token_counts[tok] = count    
    total_count = counter

    df.at[index, 'polarity']=polarity
    df.at[index, 'subjectivity']=subjectivity
    df.at[index, 'appreciation']=total_count


polarity_df = df.sort_values(by=['polarity'], ascending=False).head(5)
subjectivyty_df = df.sort_values(by=['subjectivity'], ascending=False).head(5)
appreciation_df = df.sort_values(by=['appreciation'], ascending=False).head(5)

conversation_dfs = []  # Initialize a list to store DataFrames for each conversation
context_size = 4

for loc_index in subjectivyty_df.index:
    session_id = subjectivyty_df.at[loc_index, 'Session']
    filtered_df = df[df['Session'] == session_id]
    context_df = filtered_df.iloc[max(0, loc_index - context_size):min(len(filtered_df), loc_index + context_size)]
    context_df.reset_index(drop=True, inplace=True)
    context_df = context_df.filter(items=['date', 'time', 'name', 'message_text'])
    conversation_dfs.append(context_df)

for loc_index in appreciation_df.index:
    session_id = appreciation_df.at[loc_index, 'Session']
    filtered_df = df[df['Session'] == session_id]
    context_df = filtered_df.iloc[max(0, loc_index - context_size):min(len(filtered_df), loc_index + context_size)]
    context_df = context_df.filter(items=['date', 'time', 'name', 'message_text'])
    context_df.reset_index(drop=True, inplace=True)
    conversation_dfs.append(context_df)

response = {
    "data": [],
    "plots": []
}

for frame in conversation_dfs:
    if frame.shape[0] == 0:
        pass
    conv_json1 = frame.to_json(orient="index")
    response["data"].append(conv_json1)
    print(conv_json1)
    print("new conv\n\n")
