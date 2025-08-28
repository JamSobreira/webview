from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Importar todos os modelos para garantir que sejam registrados
from .user import User
from .computador import Computador
from .funcionario import Funcionario
from .problema import Problema
from .manutencao import Manutencao
from .peca import Peca

