from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import base64
import aiohttp
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import pandas as pd
import random
import os
from json import loads, dumps
import io
import seaborn as sns
import zipfile
from textblob import TextBlob

#TOKEN of appreciation
token=['love','I miss you', 'baby', 'babe','honey','I love you', 'darling','soulmate']
#EOF

app = FastAPI()

@app.get("/")
async def main():
    content = """
<body>
<form action="/upload-zip" enctype="multipart/form-data" method="post">
<input name="file" type="file">
<input type="submit">
</form>
</body>
    """
    return HTMLResponse(content=content)

async def process(file):
    print(f'Trying to read {file.filename}')
    # Ensure the file is read into memory
    contents = await file.read()

    if file.content_type == 'application/zip':
        try:
            with zipfile.ZipFile(io.BytesIO(contents), 'r') as zip_ref:
                # Get the list of file names
                file_names = zip_ref.namelist()
                
                # Find the first text file
                text_file_name = next((name for name in file_names if name.endswith('.txt')), None)

                if text_file_name is not None:
                    with zip_ref.open(text_file_name, 'r') as text_file:
                        contents = text_file.read()
                else:
                    print('No text file found in the zip file')
        except zipfile.BadZipFile:
            print('Failed to read zip file')
            raise HTTPException(status_code=400, detail="File is not a zip file")
    elif file.content_type == 'text/plain':
        # For text files, contents are already read
        pass
    else:
        print('Unsupported file type')
        raise HTTPException(status_code=400, detail="Unsupported file type")

    print('opened successfully')

    contents_decoded = contents.decode('utf-8')
    # Parse the data
    data = []
    for line in contents_decoded.split('\n'):
        data.append(line)
    

    # Convert the bytes content to a pandas DataFrame
    # df = pd.read_csv(io.BytesIO(contents),header=None, names=['import'])  # Assuming the text file is tab-separated
    df = pd.DataFrame(data, columns=['import'])

    print(f'dataframe created : {df.shape}')
    print(f'converted df succesfully : {df.shape}')


######PREPROCESS
    #df = pd.DataFrame(data, columns=['import'])
    #Cleaning Whatsapp Error messages
    df = df[~df['import'].str.contains('Your security code')]
    df = df[~df['import'].str.contains('Media omitted')]
    df = df[~df['import'].str.contains('Messages and calls')]

    df.dropna(inplace=True)
    df = df[df['import'].str.match(r'^\d')]
    df = df[df['import'].apply(lambda x: len(x.split(" - ", 1))) >= 2]
    for index, row in df.iterrows():
        try:
            line_split = row['import'].split(" - ", 1)
            date_time = line_split[0]
            message = line_split[1]
            df.at[index, 'date'], df.at[index, 'time'] = date_time.split(", ", 1)
            df.at[index, 'name'], df.at[index, 'message_text'] = message.split(": ", 1)
        except:
            print(f"Error in line: {row['import']}")

    # Stripping \n and trailing white space
    df['message_text'] = df['message_text'].apply(lambda x: x.strip() if isinstance(x, str) else x)
    df.drop(columns=['import'], inplace=True)

    print("Preprocess Done.")

    # Instantiation
    response = {
        "data": [],
        "plots": []
    }

##### Graph Message count over time
    message_count = df.groupby('date').size()
    moving_average_30d = message_count.rolling(window=2).mean()
    plt.figure(figsize=(10, 6))
    sns.barplot(x=message_count.index, y=message_count.values, color='skyblue')
    plt.plot(moving_average_30d.index, moving_average_30d.values, color='orange', label='Moving Average (30-day)')
    plt.title('Distribution of Messages Sent Over relationship')
    plt.xlabel('Date')
    plt.ylabel('Number of Messages')
    plt.xticks([])  # Hide x-axis ticks
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    # Save the plot to a BytesIO buffer
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    # Encode base64
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')

    response["plots"].append(image_base64)

    # Sample converation
    loc_index = 5
    context_size = 4
    context_df = df.iloc[max(0, loc_index - context_size):min(len(df), loc_index + context_size + 1)]
    context_df.reset_index(drop=True, inplace=True)

    #Convert to json
    conv_json1 = context_df.to_json(orient="index")
    response["data"].append(conv_json1)

    ##PRocessing
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
    time_gap_threshold = pd.Timedelta(minutes=60*24)
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

    for frame in conversation_dfs:
        if frame.shape[0] == 0:
            pass
        conv_json1 = frame.to_json(orient="index")
        response["data"].append(conv_json1)

    return response

@app.post("/upload-zip")
async def create_upload_file(request: Request, file: UploadFile = File(...)):
    print("Headers Received:", request.headers)
    print("Content-Type:", request.headers.get('content-type'))  # Check the boundary here
    print(f'file uploaded : {file.filename}')
    
    response = await process(file)
    
    return JSONResponse(content=response)


##################################
############ fixtures ############
conv_json1 = [
    {"name": "Alice", "date": "2022-01-01", "time": "12:00:00", "message_text": "Hi Bob, how are you today?"},
    {"name": "Bob", "date": "2022-01-01", "time": "12:01:00", "message_text": "Hi Alice, I'm good thanks! What about you?"},
    {"name": "Alice", "date": "2022-01-01", "time": "12:02:00", "message_text": "I'm doing well, just getting started with my day."},
    {"name": "Bob", "date": "2022-01-01", "time": "12:05:00", "message_text": "Do you have any plans for today?"},
    {"name": "Alice", "date": "2022-01-01", "time": "12:07:00", "message_text": "Not much, just some errands to run. How about you?"},
    {"name": "Bob", "date": "2022-01-01", "time": "12:10:00", "message_text": "I'm planning to go hiking if the weather holds up."},
    {"name": "Alice", "date": "2022-01-01", "time": "12:15:00", "message_text": "That sounds like a lot of fun!"},
    {"name": "Bob", "date": "2022-01-01", "time": "12:20:00", "message_text": "Yeah, it should be. Want to join?"},
    {"name": "Alice", "date": "2022-01-01", "time": "12:22:00", "message_text": "Sure, I'd love to! What time are you thinking?"},
    {"name": "Bob", "date": "2022-01-01", "time": "12:30:00", "message_text": "How about we meet at 2 PM at the trailhead?"}
]

conv_json2 = [
    {"name": "Alice", "date": "2022-01-02", "time": "10:00:00", "message_text": "Morning Bob, are we still on for hiking today?"},
    {"name": "Bob", "date": "2022-01-02", "time": "10:02:00", "message_text": "Morning! Yes, definitely. See you at 2 PM!"},
    {"name": "Alice", "date": "2022-01-02", "time": "10:05:00", "message_text": "Great! I'm really looking forward to it."},
    {"name": "Bob", "date": "2022-01-02", "time": "10:07:00", "message_text": "Me too. Did you pack some snacks?"},
    {"name": "Alice", "date": "2022-01-02", "time": "10:10:00", "message_text": "Yes, I did. I've also brought some water and a first-aid kit."},
    {"name": "Bob", "date": "2022-01-02", "time": "10:15:00", "message_text": "Perfect! It's always good to be prepared."},
]

conv_json3 = [
    {"name": "Alice", "date": "2022-01-03", "time": "08:00:00", "message_text": "Hey Bob, I had a great time hiking yesterday!"},
    {"name": "Bob", "date": "2022-01-03", "time": "08:05:00", "message_text": "Hey Alice, me too! It was a fantastic day."},
    {"name": "Alice", "date": "2022-01-03", "time": "08:10:00", "message_text": "We should definitely do it again sometime soon."},
    {"name": "Bob", "date": "2022-01-03", "time": "08:15:00", "message_text": "Absolutely! Let's plan for another outing next month."},
]

async def fetch_image_as_base64(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status != 200:
                raise HTTPException(status_code=404, detail="Image not found")
            image_data = await response.read()
            return base64.b64encode(image_data).decode('utf-8')

@app.post("/fixtures")
async def create_fixture():
    # NBA player image URL
    image_url = "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png"
    
    # Fetch the image as base64
    image_base64 = await fetch_image_as_base64(image_url)

    # Prepare the response data
    response_data = {
        "data": [conv_json1, conv_json2, conv_json3, conv_json1, conv_json2, conv_json3],
        "plots": [image_base64, image_base64, image_base64]
    }

    return JSONResponse(content=response_data)