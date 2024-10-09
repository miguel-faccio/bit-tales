# main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from datetime import datetime
import os
print("Current Working Directory:", os.getcwd())

from back.config.database import shutdown_db, startup_db
from back.routers.users import router_usuario as user_router
from back.routers.game import router_game as game_router
from back.routers.feedback import router_feedback as feedback_router
from back.routers.categoria import router_categoria as categoria_router
from back.routers.frontrouters import router as front_router

templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "front/pages"))

app = FastAPI(title='BITTALES PAINEL ADMINISTRATIVO')

# Montar a pasta 'Front' para servir arquivos estáticos
static_dir = os.path.join(os.path.dirname(__file__), 'front/static')

if not os.path.exists(static_dir):
    raise RuntimeError(f"Directory '{static_dir}' does not exist")

app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.middleware("http")
async def add_session_to_request(request: Request, call_next):
    response = await call_next(request)
    return response

app.add_event_handler(event_type='startup', func=startup_db)
app.add_event_handler(event_type='shutdown', func=shutdown_db)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get('/')
# def read_root():
#     return {
#         'status': 'ok',
#         'time': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#     }

@app.get("/", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "Login"})

@app.get("/login", response_class=HTMLResponse)

@app.get("/cadastro", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("cadastro.html", {"request": request, "title": "Cadastro"})
@app.get("/menu", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("menu.html", {"request": request, "title": "Menu de Jogos"})
@app.get("/status", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("status.html", {"request": request, "title": "Status"})
@app.get("/dashboard", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request, "title": "Dashboard"})

# jogos
@app.get("/dogrun", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("jogos/dogRun/dog.html", {"request": request, "title": "DogRun"})

app.include_router(user_router)
app.include_router(game_router)
app.include_router(feedback_router)
app.include_router(categoria_router)
app.include_router(front_router)
