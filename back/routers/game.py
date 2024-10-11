from fastapi import APIRouter, HTTPException
from back.models.game import GameDB
from back.schemas.game import (
    GameCreate,
    GameRead,
    GameReadList,
    GameUpdate,
)

router_game = APIRouter(prefix='/games', tags=['GAMES'])

@router_game.post('', response_model=GameRead)
def criar_jogo(novo_jogo: GameCreate):
    jogo = GameDB.create(**novo_jogo.dict())
    return jogo

@router_game.get('', response_model=GameReadList)
def listar_jogos():
    jogos = GameDB.select()
    return {'games': [jogo for jogo in jogos]}

@router_game.get('/{game_id}', response_model=GameRead)
def ler_jogo(game_id: int):
    jogo = GameDB.get_or_none(GameDB.id_game == game_id)
    if not jogo:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")
    return jogo

@router_game.patch('/{game_id}', response_model=GameRead)
def atualizar_jogo(game_id: int, jogo_atualizado: GameUpdate):
    jogo = GameDB.get_or_none(GameDB.id_game == game_id)
    if not jogo:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")
    if jogo_atualizado.game_name:
        jogo.game_name = jogo_atualizado.game_name
    if jogo_atualizado.game_desc:
        jogo.game_desc = jogo_atualizado.game_desc
    if jogo_atualizado.data_lancamento_jogo:
        jogo.data_lancamento_jogo = jogo_atualizado.data_lancamento_jogo
    if jogo_atualizado.regra_game:
        jogo.regra_game = jogo_atualizado.regra_game
    if jogo_atualizado.categoria_id:
        jogo.categoria_id = jogo_atualizado.categoria_id
    jogo.save()
    return jogo

@router_game.delete('/{game_id}', response_model=GameRead)
def eliminar_jogo(game_id: int):
    jogo = GameDB.get_or_none(GameDB.id_game == game_id)
    if not jogo:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")
    jogo.delete_instance()
    return jogo
