from fastapi import APIRouter, HTTPException
from models.users import UsuarioDB
from schemas.users import (
    UsuarioCreate,
    UsuarioRead,
    UsuarioReadList,
    UsuarioUpdate,
)

router_usuario = APIRouter(prefix='/usuarios', tags=['USUÁRIOS'])

@router_usuario.post('', response_model=UsuarioRead)
def criar_usuario(novo_usuario: UsuarioCreate):
    usuario = UsuarioDB.create(**novo_usuario.dict())
    return usuario

@router_usuario.get('', response_model=UsuarioReadList)
def listar_usuarios():
    usuarios = UsuarioDB.select()
    return {'usuarios': [usuario for usuario in usuarios]}

@router_usuario.get('/{usuario_id}', response_model=UsuarioRead)
def ler_usuario(usuario_id: int):
    usuario = UsuarioDB.get_or_none(UsuarioDB.id_usuario == usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario

@router_usuario.patch('/{usuario_id}', response_model=UsuarioRead)
def atualizar_usuario(usuario_id: int, usuario_atualizado: UsuarioUpdate):
    usuario = UsuarioDB.get_or_none(UsuarioDB.id_usuario == usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if usuario_atualizado.nome_usuario:
        usuario.nome_usuario = usuario_atualizado.nome_usuario
    if usuario_atualizado.email_usuario:
        usuario.email_usuario = usuario_atualizado.email_usuario
    if usuario_atualizado.senha_usuario:
        usuario.senha_usuario = usuario_atualizado.senha_usuario
    if usuario_atualizado.usuario_foto:
        usuario.usuario_foto = usuario_atualizado.usuario_foto
    if usuario_atualizado.data_criacao_user:
        usuario.data_criacao_user = usuario_atualizado.data_criacao_user
    if usuario_atualizado.categoria_user:
        usuario.categoria_user = usuario_atualizado.categoria_user
    usuario.save()
    return usuario

@router_usuario.delete('/{usuario_id}', response_model=UsuarioRead)
def eliminar_usuario(usuario_id: int):
    usuario = UsuarioDB.get_or_none(UsuarioDB.id_usuario == usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    usuario.delete_instance()
    return usuario
