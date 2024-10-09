from pydantic import BaseModel
from typing import Optional
from datetime import date
from schemas.categoria import CategoriaRead

class GameCreate(BaseModel):
    game_name: str
    game_desc: str
    data_lancamento_jogo: date
    regra_game: str
    categoria_id: int  # Referência ao ID da categoria
    # categoria: CategoriaRead
#
class GameRead(BaseModel):
    id_game: int
    game_name: str
    game_desc: str
    data_lancamento_jogo: date
    regra_game: str
    # cartegoria: int  # Referência ao ID da categoria
    categoria: CategoriaRead
class GameUpdate(BaseModel):
    game_name: Optional[str] = None
    game_desc: Optional[str] = None
    data_lancamento_jogo: Optional[date] = None
    regra_game: Optional[str] = None
    categoria_id: int

class GameReadList(BaseModel):
    games: list[GameRead]
