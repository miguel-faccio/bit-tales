from pydantic import BaseModel

class CategoriaCreate(BaseModel):
    nome_categoria: str

class CategoriaRead(BaseModel):
    id_cartegoria: int
    nome_categoria: str

class CategoriaUpdate(BaseModel):
    nome_categoria: str

class CategoriaReadList(BaseModel):
    categorias: list[CategoriaRead]
