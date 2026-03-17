from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserRegister(UserBase):
    userid: str
    password: str

class UserLogin(BaseModel):
    key: str
    password: str

class User(BaseModel):
    name: str
    userid: str

class NoteCreate(BaseModel):
    title: str
    content: str
    tag: str

class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    tag: str | None = None
    noteid: int

class Note(NoteCreate):
    noteid: int
    userid: str
    createdAt: datetime