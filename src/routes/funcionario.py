from flask import Blueprint, request, jsonify
from src.models import db
from src.models.funcionario import Funcionario
from datetime import datetime

funcionario_bp = Blueprint('funcionario', __name__)

@funcionario_bp.route('/funcionarios', methods=['GET'])
def get_funcionarios():
    try:
        funcionarios = Funcionario.query.all()
        return jsonify([funcionario.to_dict() for funcionario in funcionarios]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios/<int:id>', methods=['GET'])
def get_funcionario(id):
    try:
        funcionario = Funcionario.query.get_or_404(id)
        return jsonify(funcionario.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios', methods=['POST'])
def create_funcionario():
    try:
        data = request.get_json()
        
        # Validação básica
        if not data or not all(k in data for k in ('nome', 'cargo', 'departamento')):
            return jsonify({'error': 'Dados obrigatórios: nome, cargo, departamento'}), 400
        
        funcionario = Funcionario(
            nome=data['nome'],
            cargo=data['cargo'],
            departamento=data['departamento']
        )
        
        db.session.add(funcionario)
        db.session.commit()
        
        return jsonify(funcionario.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios/<int:id>', methods=['PUT'])
def update_funcionario(id):
    try:
        funcionario = Funcionario.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Nenhum dado fornecido'}), 400
        
        # Atualizar campos
        if 'nome' in data:
            funcionario.nome = data['nome']
        if 'cargo' in data:
            funcionario.cargo = data['cargo']
        if 'departamento' in data:
            funcionario.departamento = data['departamento']
        
        funcionario.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(funcionario.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios/<int:id>', methods=['DELETE'])
def delete_funcionario(id):
    try:
        funcionario = Funcionario.query.get_or_404(id)
        
        # Verificar se há manutenções associadas
        if funcionario.manutencoes:
            return jsonify({'error': 'Não é possível excluir funcionário com manutenções associadas'}), 400
        
        db.session.delete(funcionario)
        db.session.commit()
        
        return jsonify({'message': 'Funcionário excluído com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@funcionario_bp.route('/funcionarios/search', methods=['GET'])
def search_funcionarios():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200
        
        funcionarios = Funcionario.query.filter(
            (Funcionario.nome.contains(query)) |
            (Funcionario.cargo.contains(query)) |
            (Funcionario.departamento.contains(query))
        ).all()
        
        return jsonify([funcionario.to_dict() for funcionario in funcionarios]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

