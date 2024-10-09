from peewee import SqliteDatabase, MySQLDatabase

# DATABASE_PATH = 'database.bd'
# database = SqliteDatabase('bittalesv1.db')

database = MySQLDatabase(
    database='bit-tales',
    user ='root',
    password ='',
    host ='localhost',
    port=3306,

)

def startup_db():
    database.connect()

    from models.users import UsuarioDB
    from models.game import GameDB
    from models.categoria import CategoriaDB
    from models.feedback import FeedbackDB

    database.create_tables(
        [
            UsuarioDB,
            GameDB,
            CategoriaDB,
            FeedbackDB,

        ]
    )


def shutdown_db():
    database.close()