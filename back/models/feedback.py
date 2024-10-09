from peewee import AutoField, CharField, ForeignKeyField, Model, TextField
from enum import Enum
from config.database import database
from models.users import UsuarioDB

class RatingEnum(Enum):
    ZERO = 0
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5

class FeedbackDB(Model):
    id_feedback = AutoField()  # Chave primária
    text_feed = TextField(null=True)  # Texto do feedback, pode ser NULL
    rating = CharField(choices=[(r.value, r.name) for r in RatingEnum])  # Enum de rating ('0' a '5')
    usuario = ForeignKeyField(UsuarioDB, backref='feedbacks')  # Chave estrangeira para UsuarioDB

    class Meta:
        database = database  # Conecta ao banco de dados definido no arquivo de configuração
        table_name = 'feedback'  # Nome da tabela no banco de dados
