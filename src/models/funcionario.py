from . import db
from datetime import datetime

class Funcionario(db.Model):
    __tablename__ = 'funcionarios'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    cargo = db.Column(db.String(100), nullable=False)
    departamento = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com manutenções
    manutencoes = db.relationship('Manutencao', backref='funcionario', lazy=True)

    def __repr__(self):
        return f'<Funcionario {self.nome} - {self.cargo}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cargo': self.cargo,
            'departamento': self.departamento,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

