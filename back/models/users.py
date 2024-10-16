from peewee import Model, AutoField, CharField, DateTimeField, IntegerField
from enum import IntEnum
from back.config.database import database


# Definindo um Enum para as categorias de usuários
class CategoriaUserEnum(IntEnum):
    USER = 1
    GUEST = 2
    ADMIN = 3


class UsuarioDB(Model):
    id_usuario = AutoField()
    nome_usuario = CharField()
    email_usuario = CharField()
    senha_usuario = CharField()

    # Usando IntegerField para armazenar a categoria do usuário como um número (1, 2, 3)
    categoria_user = IntegerField(choices=[(tag.value, tag.name) for tag in CategoriaUserEnum])



    class Meta:
        database = database
        table_name = 'usuarios'
