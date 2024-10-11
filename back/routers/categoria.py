from fastapi import APIRouter, HTTPException
from back.models.categoria import CategoriaDB
from back.schemas.categoria import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaReadList,
    CategoriaUpdate,
)

router_categoria = APIRouter(prefix='/categorias', tags=['CATEGORIAS'])

@router_categoria.post('', response_model=CategoriaRead)
def criar_categoria(nova_categoria: CategoriaCreate):
    categoria = CategoriaDB.create(**nova_categoria.dict())
    return categoria

@router_categoria.get('', response_model=CategoriaReadList)
def listar_categorias():
    categorias = CategoriaDB.select()
    return {'categorias': [categoria for categoria in categorias]}

@router_categoria.get('/{categoria_id}', response_model=CategoriaRead)
def ler_categoria(categoria_id: int):
    categoria = CategoriaDB.get_or_none(CategoriaDB.id_cartegoria == categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return categoria

@router_categoria.patch('/{categoria_id}', response_model=CategoriaRead)
def atualizar_categoria(categoria_id: int, categoria_atualizada: CategoriaUpdate):
    categoria = CategoriaDB.get_or_none(CategoriaDB.id_cartegoria == categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    categoria.nome_categoria = categoria_atualizada.nome_categoria
    categoria.save()
    return categoria

@router_categoria.delete('/{categoria_id}', response_model=CategoriaRead)
def eliminar_categoria(categoria_id: int):
    categoria = CategoriaDB.get_or_none(CategoriaDB.id_cartegoria == categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    categoria.delete_instance()
    return categoria
