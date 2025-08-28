from flask import Blueprint, request, jsonify
from src.models import db
from src.models.problema import Problema
from datetime import datetime

problema_bp = Blueprint('problema', __name__)

@problema_bp.route('/problemas', methods=['GET'])
def get_problemas():
    try:
        problemas = Problema.query.all()
        return jsonify([problema.to_dict() for problema in problemas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@problema_bp.route('/problemas/<int:id>', methods=['GET'])
def get_problema(id):
    try:
        problema = Problema.query.get_or_404(id)
        return jsonify(problema.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@problema_bp.route('/problemas', methods=['POST'])
def create_problema():
    try:
        data = request.get_json()
        
        # Validação básica
        if not data or not all(k in data for k in ('descricao', 'categoria')):
            return jsonify({'error': 'Dados obrigatórios: descricao, categoria'}), 400
        
        problema = Problema(
            descricao=data['descricao'],
            categoria=data['categoria']
        )
        
        db.session.add(problema)
        db.session.commit()
        
        return jsonify(problema.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@problema_bp.route('/problemas/<int:id>', methods=['PUT'])
def update_problema(id):
    try:
        problema = Problema.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Nenhum dado fornecido'}), 400
        
        # Atualizar campos
        if 'descricao' in data:
            problema.descricao = data['descricao']
        if 'categoria' in data:
            problema.categoria = data['categoria']
        
        problema.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(problema.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@problema_bp.route('/problemas/<int:id>', methods=['DELETE'])
def delete_problema(id):
    try:
        problema = Problema.query.get_or_404(id)
        
        # Verificar se há manutenções associadas
        if problema.manutencoes:
            return jsonify({'error': 'Não é possível excluir problema com manutenções associadas'}), 400
        
        db.session.delete(problema)
        db.session.commit()
        
        return jsonify({'message': 'Problema excluído com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@problema_bp.route('/problemas/search', methods=['GET'])
def search_problemas():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200
        
        problemas = Problema.query.filter(
            (Problema.descricao.contains(query)) |
            (Problema.categoria.contains(query))
        ).all()
        
        return jsonify([problema.to_dict() for problema in problemas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@problema_bp.route('/problemas/categorias', methods=['GET'])
def get_categorias():
    try:
        categorias = db.session.query(Problema.categoria).distinct().all()
        return jsonify([categoria[0] for categoria in categorias]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

