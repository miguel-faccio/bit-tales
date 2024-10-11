from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
import os
from back.models.users import UsuarioDB

# Configurações do JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

# Função para criar o token JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Função para autenticar e verificar o token JWT
async def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return {"username": username}

# Configurações de templates e arquivos estáticos
templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "../../front/pages"))

# Criando o router
router = APIRouter()

# Definindo rotas
@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = UsuarioDB.get_or_none(UsuarioDB.email_usuario == form_data.username)
    if form_data.password == user.senha_usuario:
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Invalid credentials")

@router.get("/", response_class=HTMLResponse)
async def show_login_form(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "Login"})

@router.get("/dashboard", response_class=HTMLResponse)
async def read_dashboard(request: Request, current_user: dict = Depends(get_current_user)):
    return templates.TemplateResponse("dashboard.html", {"request": request, "title": "Dashboard"})

@router.get("/menu", response_class=HTMLResponse)
async def read_menu(request: Request, current_user: dict = Depends(get_current_user)):
    return templates.TemplateResponse("menu.html", {"request": request, "title": "Menu de Jogos"})

@router.get("/status", response_class=HTMLResponse)
async def read_status(request: Request, current_user: dict = Depends(get_current_user)):
    return templates.TemplateResponse("status.html", {"request": request, "title": "Status"})

@router.get("/cadastro", response_class=HTMLResponse)
async def show_register_form(request: Request):
    return templates.TemplateResponse("cadastro.html", {"request": request, "title": "Cadastro"})

@router.get("/dogrun", response_class=HTMLResponse)
async def read_dogrun(request: Request, current_user: dict = Depends(get_current_user)):
    return templates.TemplateResponse("jogos/dogRun/dog.html", {"request": request, "title": "DogRun"})
