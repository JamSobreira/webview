from flask import Blueprint, request, jsonify
from src.models import db
from src.models.peca import Peca
from datetime import datetime

peca_bp = Blueprint('peca', __name__)

@peca_bp.route('/pecas', methods=['GET'])
def get_pecas():
    try:
        pecas = Peca.query.all()
        return jsonify([peca.to_dict() for peca in pecas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@peca_bp.route('/pecas/<int:id>', methods=['GET'])
def get_peca(id):
    try:
        peca = Peca.query.get_or_404(id)
        return jsonify(peca.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@peca_bp.route('/pecas', methods=['POST'])
def create_peca():
    try:
        data = request.get_json()
        
        # Validação básica
        required_fields = ['nome_peca', 'fabricante', 'data_aquisicao_peca', 'custo']
        if not data or not all(k in data for k in required_fields):
            return jsonify({'error': f'Dados obrigatórios: {", ".join(required_fields)}'}), 400
        
        # Converter data
        data_aquisicao = datetime.strptime(data['data_aquisicao_peca'], '%Y-%m-%d').date()
        
        peca = Peca(
            nome_peca=data['nome_peca'],
            numero_serie_peca=data.get('numero_serie_peca'),
            fabricante=data['fabricante'],
            data_aquisicao_peca=data_aquisicao,
            custo=float(data['custo']),
            manutencao_id=data.get('manutencao_id')
        )
        
        db.session.add(peca)
        db.session.commit()
        
        return jsonify(peca.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@peca_bp.route('/pecas/<int:id>', methods=['PUT'])
def update_peca(id):
    try:
        peca = Peca.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Nenhum dado fornecido'}), 400
        
        # Atualizar campos
        if 'nome_peca' in data:
            peca.nome_peca = data['nome_peca']
        if 'numero_serie_peca' in data:
            peca.numero_serie_peca = data['numero_serie_peca']
        if 'fabricante' in data:
            peca.fabricante = data['fabricante']
        if 'data_aquisicao_peca' in data:
            peca.data_aquisicao_peca = datetime.strptime(data['data_aquisicao_peca'], '%Y-%m-%d').date()
        if 'custo' in data:
            peca.custo = float(data['custo'])
        if 'manutencao_id' in data:
            peca.manutencao_id = data['manutencao_id']
        
        peca.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(peca.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@peca_bp.route('/pecas/<int:id>', methods=['DELETE'])
def delete_peca(id):
    try:
        peca = Peca.query.get_or_404(id)
        
        db.session.delete(peca)
        db.session.commit()
        
        return jsonify({'message': 'Peça excluída com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@peca_bp.route('/pecas/search', methods=['GET'])
def search_pecas():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200
        
        pecas = Peca.query.filter(
            (Peca.nome_peca.contains(query)) |
            (Peca.fabricante.contains(query)) |
            (Peca.numero_serie_peca.contains(query))
        ).all()
        
        return jsonify([peca.to_dict() for peca in pecas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@peca_bp.route('/pecas/disponiveis', methods=['GET'])
def get_pecas_disponiveis():
    try:
        # Peças que não estão associadas a nenhuma manutenção
        pecas = Peca.query.filter_by(manutencao_id=None).all()
        return jsonify([peca.to_dict() for peca in pecas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

