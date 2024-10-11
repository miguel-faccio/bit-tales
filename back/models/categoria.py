from peewee import AutoField, CharField, Model
from back.config.database import database

class CategoriaDB(Model):
    id_cartegoria = AutoField()  # Chave primária
    nome_categoria = CharField(max_length=100)  # Nome da categoria (varchar 100)

    class Meta:
        database = database  # Conecta ao banco de dados definido no arquivo de configuração
        table_name = 'categoria'  # Nome da tabela no banco de dados
