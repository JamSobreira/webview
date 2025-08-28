from . import db
from datetime import datetime

class Problema(db.Model):
    __tablename__ = 'problemas'
    
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(500), nullable=False)
    categoria = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com manutenções
    manutencoes = db.relationship('Manutencao', backref='problema', lazy=True)

    def __repr__(self):
        return f'<Problema {self.descricao} - {self.categoria}>'

    def to_dict(self):
        return {
            'id': self.id,
            'descricao': self.descricao,
            'categoria': self.categoria,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

