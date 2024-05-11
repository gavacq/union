from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import shutil  # Import shutil module

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

@app.post("/items/")
async def create_item(item: Item):
    return {"name": item.name, "price": item.price}

# async def read_root():
#     return {"Hello": "World"}

@app.get("/")
async def main():
    content = """
<body>
<form action="/upload-zip/" enctype="multipart/form-data" method="post">
<input name="file" type="file">
<input type="submit">
</form>
</body>
    """
    return HTMLResponse(content=content)


@app.post("/upload-zip/")
async def create_upload_file(file: UploadFile = File(...)):
    if file.content_type != 'application/zip':
        return {"message": "Invalid file type, please upload a ZIP file."}
    # Save the uploaded ZIP file to disk (for example purposes)
    with open(f"uploaded_files/{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file.filename}