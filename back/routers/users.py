from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from back.models.users import UsuarioDB
from back.schemas.users import (
    UsuarioCreate,
    UsuarioRead,
    UsuarioReadList,
    UsuarioUpdate,
)

# Configura o contexto de criptografia (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Função para criar o hash da senha
def get_password_hash(password: str):
    return pwd_context.hash(password)


router_usuario = APIRouter(prefix='/usuarios', tags=['USUÁRIOS'])


# Rota para criar um novo usuário
@router_usuario.post('', response_model=UsuarioRead)
def criar_usuario(novo_usuario: UsuarioCreate):
    # Criptografa a senha antes de salvar
    novo_usuario.senha_usuario = get_password_hash(novo_usuario.senha_usuario)

    # Cria o usuário no banco de dados
    usuario = UsuarioDB.create(**novo_usuario.dict())
    return usuario


# Rota para listar todos os usuários
@router_usuario.get('', response_model=UsuarioReadList)
def listar_usuarios():
    usuarios = UsuarioDB.select()
    return {'usuarios': [usuario for usuario in usuarios]}


# Rota para ler um usuário específico pelo ID
@router_usuario.get('/{usuario_id}', response_model=UsuarioRead)
def ler_usuario(usuario_id: int):
    usuario = UsuarioDB.get_or_none(UsuarioDB.id_usuario == usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario


# Rota para atualizar os dados de um usuário
@router_usuario.patch('/{usuario_id}', response_model=UsuarioRead)
def atualizar_usuario(usuario_id: int, usuario_atualizado: UsuarioUpdate):
    usuario = UsuarioDB.get_or_none(UsuarioDB.id_usuario == usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Atualiza os campos fornecidos
    if usuario_atualizado.nome_usuario:
        usuario.nome_usuario = usuario_atualizado.nome_usuario
    if usuario_atualizado.email_usuario:
        usuario.email_usuario = usuario_atualizado.email_usuario
    # Verifica se a senha foi atualizada e a criptografa
    if usuario_atualizado.senha_usuario:
        usuario.senha_usuario = get_password_hash(usuario_atualizado.senha_usuario)
    if usuario_atualizado.categoria_user:
        usuario.categoria_user = usuario_atualizado.categoria_user

    # Salva as atualizações no banco de dados
    usuario.save()
    return usuario


# Rota para deletar um usuário pelo ID
@router_usuario.delete('/{usuario_id}', response_model=UsuarioRead)
def eliminar_usuario(usuario_id: int):
    usuario = UsuarioDB.get_or_none(UsuarioDB.id_usuario == usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Deleta o usuário do banco de dados
    usuario.delete_instance()
    return usuario
