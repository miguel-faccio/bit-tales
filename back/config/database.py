from peewee import SqliteDatabase, MySQLDatabase

# DATABASE_PATH = 'database.bd'
# database = SqliteDatabase('bittalesv1.db')

database = MySQLDatabase(
    database='bit-tales',
    user='root',
    password='',
    host='localhost',
    port=3306,
)

def startup_db():
    database.connect()

    from back.models.users import UsuarioDB
    from back.models.game import GameDB
    from back.models.categoria import CategoriaDB
    from back.models.feedback import FeedbackDB

    database.create_tables(
        [
            UsuarioDB,
            GameDB,
            CategoriaDB,
            FeedbackDB,
        ],
        safe=True,  # Para evitar erros se as tabelas já existirem
    )

def shutdown_db():
    if not database.is_closed():
        database.close()
