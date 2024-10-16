from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UsuarioCreate(BaseModel):
    nome_usuario: str
    email_usuario: str
    senha_usuario: str
    categoria_user: int  # Referência à categoria (ID)

class UsuarioRead(BaseModel):
    id_usuario: int
    nome_usuario: str
    email_usuario: str
    senha_usuario: str
    categoria_user: int  # Referência à categoria (ID)



class UsuarioReadWithFeedback(BaseModel):
    id_usuario: int
    nome_usuario: str
    email_usuario: str

class UsuarioUpdate(BaseModel):
    nome_usuario: Optional[str] = None
    email_usuario: Optional[str] = None
    senha_usuario: Optional[str] = None
    categoria_user: Optional[int] = None  # Referência à categoria (ID)


class UsuarioReadList(BaseModel):
    usuarios: list[UsuarioRead]
