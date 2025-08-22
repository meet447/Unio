from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api.router,
    prefix="/v1/api",
)

@app.get('/')
async def root():
    return {"message": "Welcome to the ChatGPT API!"}
