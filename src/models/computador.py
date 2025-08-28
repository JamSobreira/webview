from . import db
from datetime import datetime

class Computador(db.Model):
    __tablename__ = 'computadores'
    
    id = db.Column(db.Integer, primary_key=True)
    marca = db.Column(db.String(100), nullable=False)
    modelo = db.Column(db.String(100), nullable=False)
    numero_serie = db.Column(db.String(100), unique=True, nullable=False)
    data_aquisicao = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com manutenções
    manutencoes = db.relationship('Manutencao', backref='computador', lazy=True)

    def __repr__(self):
        return f'<Computador {self.marca} {self.modelo} - {self.numero_serie}>'

    def to_dict(self):
        return {
            'id': self.id,
            'marca': self.marca,
            'modelo': self.modelo,
            'numero_serie': self.numero_serie,
            'data_aquisicao': self.data_aquisicao.isoformat() if self.data_aquisicao else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

