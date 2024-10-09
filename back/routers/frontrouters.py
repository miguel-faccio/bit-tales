# routers/frontrouters.py

from fastapi import APIRouter

router = APIRouter()

# Rota de login
@router.post('/login')
async def login(username: str, password: str):
    # Lógica de autenticação aqui
    return {"message": "Login bem-sucedido!"}

# Rota de cadastro
@router.post('/register')
async def register(username: str, password: str):
    # Lógica de registro aqui
    return {"message": "Cadastro bem-sucedido!"}

# Rota do menu de jogos
@router.get('/games')
async def get_games():
    # Retorne uma lista de jogos
    return {"games": ["Jogo 1", "Jogo 2", "Jogo 3"]}

# Rota do perfil
@router.get('/profile/{username}')
async def get_profile(username: str):
    # Lógica para obter informações do perfil do usuário
    return {"username": username, "score": 100}  # Exemplo de retorno

# Rotas para cada jogo
for i in range(1, 13):  # 12 jogos
    @router.get(f'/game/{i}')
    async def get_game(i: int):
        # Lógica para retornar informações do jogo i
        return {"game": f"Jogo {i}", "description": f"Descrição do Jogo {i}"}

# Adicione aqui outras rotas conforme necessário
