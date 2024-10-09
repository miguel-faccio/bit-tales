from peewee import AutoField, CharField, DateField, ForeignKeyField, Model, TextField
from config.database import database
from models.categoria import CategoriaDB  # Certifique-se de que o modelo CategoriaDB esteja importado


class GameDB(Model):
    id_game = AutoField()  # Chave primária
    game_name = CharField(max_length=255)  # Nome do jogo
    game_desc = TextField()  # Descrição do jogo
    data_lancamento_jogo = DateField()  # Data de lançamento
    regra_game = TextField()  # Regras do jogo

    # Chave estrangeira referenciando a tabela CategoriaDB (categoria_id_categoria)
    categoria = ForeignKeyField(CategoriaDB, backref='games')

    class Meta:
        database = database  # Conecta ao banco de dados definido no arquivo de configuração
        table_name = 'game'  # Nome da tabela no banco de dados
