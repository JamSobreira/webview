from . import db
from datetime import datetime

class Peca(db.Model):
    __tablename__ = 'pecas'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_peca = db.Column(db.String(200), nullable=False)
    numero_serie_peca = db.Column(db.String(100), nullable=True)
    fabricante = db.Column(db.String(100), nullable=False)
    data_aquisicao_peca = db.Column(db.Date, nullable=False)
    custo = db.Column(db.Numeric(10, 2), nullable=False)
    manutencao_id = db.Column(db.Integer, db.ForeignKey('manutencoes.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Peca {self.nome_peca} - {self.fabricante}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome_peca': self.nome_peca,
            'numero_serie_peca': self.numero_serie_peca,
            'fabricante': self.fabricante,
            'data_aquisicao_peca': self.data_aquisicao_peca.isoformat() if self.data_aquisicao_peca else None,
            'custo': float(self.custo) if self.custo else 0,
            'manutencao_id': self.manutencao_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

