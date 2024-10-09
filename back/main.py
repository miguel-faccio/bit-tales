# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # Importar para servir arquivos estáticos
from datetime import datetime
import os

from config.database import shutdown_db, startup_db
from routers.users import router_usuario as user_router
from routers.game import router_game as game_router
from routers.feedback import router_feedback as feedback_router
from routers.categoria import router_categoria as categoria_router
from routers.frontrouters import router as front_router
from fastapi.responses import HTMLResponse  # Adicione esta importação


app = FastAPI(title='BITTALES PAINEL ADMINISTRATIVO')

# Montar a pasta 'Front' para servir arquivos estáticos
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), '../Front')), name="static")

app.add_event_handler(event_type='startup', func=startup_db)
app.add_event_handler(event_type='shutdown', func=shutdown_db)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {
        'status': 'ok',
        'time': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }


@app.get('/index', response_class=HTMLResponse)  # Especifique que a resposta é HTML
async def load_index():
    # Caminho correto para o arquivo HTML
    with open(os.path.join(os.path.dirname(__file__), '../Front/pages/index.html')) as f:
        return f.read()

@app.get('/status', response_class=HTMLResponse)  # Especifique que a resposta é HTML
async def load_index():
       with open(os.path.join(os.path.dirname(__file__), '../Front/pages/status.html')) as f:
            return f.read()
app.include_router(user_router)
app.include_router(game_router)
app.include_router(feedback_router)
app.include_router(categoria_router)
app.include_router(front_router)
