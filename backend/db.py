import sqlite3


create_table_query = """
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        date_added TEXT NOT NULL,
        start_time TEXT NULL,
        end_time TEXT NULL,
        completed BOOLEAN NOT NULL
    )
    """

create_task_log_query = """
    CREATE TABLE IF NOT EXISTS task_log (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        title TEXT,
        category TEXT,
        start_time TEXT,
        end_time TEXT,
        completed BOOLEAN,
        updated_at TEXT,
        FOREIGN KEY (task_id) REFERENCES tasks (id)
        )
    """


class DatabaseConnection:
    def __init__(self, db_name="tot.db"):
        self.db_name = db_name
        self.conn = None  # Initialize connection to None

    def __enter__(self):
        self.conn = sqlite3.connect(self.db_name)
        return self.conn

    def __exit__(self, exc_type, exc_value, traceback):
        if self.conn:
            self.conn.close()


def init_db():
    return DatabaseConnection()


def create_tables():
    with init_db() as conn:
        try:
            cursor = conn.cursor()
            print("Creating tables")
            cursor.execute(create_table_query)
            cursor.execute(create_task_log_query)
            print("Tables created successfully")
            conn.commit()
        except sqlite3.OperationalError as e:
            print(e)
