from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Importar o router principal do mainrouters
from back.routers.mainrouters import router as main_router

# Criar o app FastAPI
app = FastAPI(title='BITTALES PAINEL ADMINISTRATIVO')

# Configurações de arquivos estáticos
static_dir = os.path.join(os.path.dirname(__file__), 'front/static')


if not os.path.exists(static_dir):
    raise RuntimeError(f"Directory '{static_dir}' does not exist")

app.mount("/static", StaticFiles(directory=static_dir), name="static")


# Adicionar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust according to your requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir o main_router
app.include_router(main_router)

# Incluir outros routers adicionais
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
