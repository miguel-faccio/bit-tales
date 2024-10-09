from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from passlib.context import CryptContext
from typing import Optional
from back.models.users import UsuarioDB

# Configurações do JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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
        status_code=status.HTTP_401_UNAUTHORIZED,
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

# Criação do app FastAPI
app = FastAPI(title='BITTALES PAINEL ADMINISTRATIVO')

# Configurações de templates e arquivos estáticos
templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "front/pages"))
static_dir = os.path.join(os.path.dirname(__file__), 'front/static')

if not os.path.exists(static_dir):
    raise RuntimeError(f"Directory '{static_dir}' does not exist")

app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Adicionar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Função para gerar token (login)
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Substitua pelo seu método de validação de usuário
    user = UsuarioDB.get_or_none(UsuarioDB.email_usuario == form_data.username)

    if form_data.password == user.senha_usuario:
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Invalid credentials")

# Rota de login (apenas para exibir o formulário de login)
@app.get("/", response_class=HTMLResponse)
async def show_login_form(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "Login"})

# Exemplo de rota autenticada (necessita de token JWT)
@app.get("/dashboard", response_class=HTMLResponse)
async def read_dashboard(request: Request, current_user: dict = Depends(get_current_user)):
    return templates.TemplateResponse("dashboard.html", {"request": request, "title": "Dashboard"})

# Outras rotas que precisam de autenticação
@app.get("/menu", response_class=HTMLResponse)
async def read_menu(request: Request, current_user: dict = Depends(get_current_user)):
    return templates.TemplateResponse("menu.html", {"request": request, "title": "Menu de Jogos"})

@app.get("/status", response_class=HTMLResponse)
async def read_status(request: Request, current_user: dict = Depends(get_current_user)):
    return templates.TemplateResponse("status.html", {"request": request, "title": "Status"})

# Rota de cadastro
@app.get("/cadastro", response_class=HTMLResponse)
async def show_register_form(request: Request):
    return templates.TemplateResponse("cadastro.html", {"request": request, "title": "Cadastro"})

# Jogos
@app.get("/dogrun", response_class=HTMLResponse)
async def read_dogrun(request: Request, current_user: dict = Depends(get_current_user)):
    return templates.TemplateResponse("jogos/dogRun/dog.html", {"request": request, "title": "DogRun"})

# Incluir routers adicionais
from back.config.database import shutdown_db, startup_db
from back.routers.users import router_usuario as user_router
from back.routers.game import router_game as game_router
from back.routers.feedback import router_feedback as feedback_router
from back.routers.categoria import router_categoria as categoria_router


app.add_event_handler(event_type='startup', func=startup_db)
app.add_event_handler(event_type='shutdown', func=(shutdown_db))

app.include_router(user_router)
app.include_router(game_router)
app.include_router(feedback_router)
app.include_router(categoria_router)

