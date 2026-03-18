from fastapi import FastAPI, HTTPException,status,Depends,Query
from pydantic import BaseModel,EmailStr
from datetime import datetime
from sqlmodel import SQLModel, Session, Field, create_engine,select
from sqlalchemy import or_,and_
from typing import Annotated

#Database Schemas
class UserDB(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    name:str
    userid: str
    email: EmailStr
    password: str    

class NoteDB(SQLModel,table=True):
    __tablename__ = "notes"
    title: str
    content: str
    tag: str|None = Field(default=None, index=True)
    noteid: int = Field(default=None, primary_key=True)
    userid: str = Field(foreign_key="users.userid",index=True)
    createdAt: datetime

sqlite_file_name="database.db"
sqlite_url=f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine=create_engine(sqlite_url,connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
def get_session():
    with Session(engine) as session:
        yield session

SessionDep= Annotated[Session,Depends(get_session)]



#pydantic Schemas
class User_base(BaseModel):
    name: str
    email: EmailStr

class User_register(User_base):
    name: str
    email: EmailStr
    userid: str
    password: str

class User_login(BaseModel):
    key:str
    password:str

class User(BaseModel):
    name:str
    userid:str
    email:EmailStr




class Note_Create_and_Response(BaseModel):
    title: str
    content: str
    tag: str
   
class Notes_Update(BaseModel):
    title: str | None
    content: str | None
    tag: str | None
    noteid:int

class Note(Note_Create_and_Response):
    noteid:int
    userid:str
    createdAt: datetime


app= FastAPI(title="Notes Taker")
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def Welcome():
    return {"message": "Welcome to Notes app"}

@app.post("/register",response_model=User)
def user_register(user: User_register,session: SessionDep):

    query=select(UserDB).where(or_(UserDB.email==user.email, UserDB.userid==user.userid))
    req=session.exec(query)
    
    user_db=req.all()
    
    if user_db:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User Exists"
        )
    
    user_db= UserDB(
        userid=user.userid,
        name=user.name,
        email=user.email,
        password=user.password
    )
    
    session.add(user_db)
    session.commit()
    session.refresh(user_db)
    
    return user_db

@app.post("/login",response_model=User)
def user_login(req_user:User_login,session: SessionDep):

    user_data=session.exec(select(UserDB).where(or_(UserDB.userid== req_user.key,UserDB.email==req_user.key))).first()
    
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    
    if user_data.password!=req_user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid credentials"
        )

    return user_data



@app.get("/{userid}/notes", response_model=list[Note])
def get_all_notes(
    userid: str,
    session: SessionDep,
    tag: str | None = None,
    sort: int = 1,
    limit: int = 10,
    page: int = 1
):
    offset = (page - 1) * limit

    query = select(NoteDB).where(NoteDB.userid == userid)

    if tag:
        query = query.where(NoteDB.tag == tag)

    if sort == 1:
        query = query.order_by(NoteDB.createdAt.asc())
    else:
        query = query.order_by(NoteDB.createdAt.desc())

    query = query.offset(offset).limit(limit)

    notes = session.exec(query).all()

    return notes

@app.post("/create-note/{userid}",response_model=Note_Create_and_Response)
def create_note(userid:str,notes: Note_Create_and_Response,session: SessionDep):
    user_db=session.exec(select(UserDB).where(UserDB.userid==userid)).first()

    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not valid"
        )
    
    notes_data= notes.model_dump()
    notes_data["userid"]=userid
    notes_data["createdAt"]=datetime.now()

    notes_db= NoteDB(**notes_data)
    session.add(notes_db)
    session.commit()
    session.refresh(notes_db)
   
    return notes_db

#update form, click update button, then response willbe se
@app.post("/update-note",response_model=Note_Create_and_Response)
def update_note(req_notes: Notes_Update,session:SessionDep):

    res= session.exec(select(NoteDB).where(NoteDB.noteid==req_notes.noteid )).first()
    notes= res

    if not notes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    update_data = req_notes.model_dump(exclude_unset=True,exclude={"noteid"})
    for key, value in update_data.items():
        setattr(notes, key, value)
  
    session.commit()
    session.refresh(notes)
    return notes

@app.delete("/note/{notes_id}")
def delete_note(notes_id:int, session:SessionDep):
    
    notes=session.exec(select(NoteDB).where(NoteDB.noteid==notes_id)).first()

    if not notes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notes not found"
        ) 
    
    session.delete(notes)
    session.commit()

    return {"Status": "deleted"}