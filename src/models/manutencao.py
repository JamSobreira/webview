from . import db
from datetime import datetime

class Manutencao(db.Model):
    __tablename__ = 'manutencoes'
    
    id = db.Column(db.Integer, primary_key=True)
    computador_id = db.Column(db.Integer, db.ForeignKey('computadores.id'), nullable=False)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    problema_id = db.Column(db.Integer, db.ForeignKey('problemas.id'), nullable=False)
    data_manutencao = db.Column(db.DateTime, nullable=False)
    tipo_manutencao = db.Column(db.String(50), nullable=False)
    descricao_problema = db.Column(db.Text, nullable=False)
    solucao_aplicada = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com peças
    pecas = db.relationship('Peca', backref='manutencao', lazy=True)

    def __repr__(self):
        return f'<Manutencao {self.id} - {self.tipo_manutencao}>'

    def to_dict(self):
        return {
            'id': self.id,
            'computador_id': self.computador_id,
            'funcionario_id': self.funcionario_id,
            'problema_id': self.problema_id,
            'data_manutencao': self.data_manutencao.isoformat() if self.data_manutencao else None,
            'tipo_manutencao': self.tipo_manutencao,
            'descricao_problema': self.descricao_problema,
            'solucao_aplicada': self.solucao_aplicada,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'computador': self.computador.to_dict() if self.computador else None,
            'funcionario': self.funcionario.to_dict() if self.funcionario else None,
            'problema': self.problema.to_dict() if self.problema else None,
            'pecas': [peca.to_dict() for peca in self.pecas] if self.pecas else []
        }

