from flask import Blueprint, request, jsonify
from src.models import db
from src.models.computador import Computador
from datetime import datetime

computador_bp = Blueprint('computador', __name__)

@computador_bp.route('/computadores', methods=['GET'])
def get_computadores():
    try:
        computadores = Computador.query.all()
        return jsonify([computador.to_dict() for computador in computadores]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@computador_bp.route('/computadores/<int:id>', methods=['GET'])
def get_computador(id):
    try:
        computador = Computador.query.get_or_404(id)
        return jsonify(computador.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@computador_bp.route('/computadores', methods=['POST'])
def create_computador():
    try:
        data = request.get_json()
        
        # Validação básica
        if not data or not all(k in data for k in ('marca', 'modelo', 'numero_serie', 'data_aquisicao')):
            return jsonify({'error': 'Dados obrigatórios: marca, modelo, numero_serie, data_aquisicao'}), 400
        
        # Verificar se número de série já existe
        if Computador.query.filter_by(numero_serie=data['numero_serie']).first():
            return jsonify({'error': 'Número de série já existe'}), 400
        
        # Converter data
        data_aquisicao = datetime.strptime(data['data_aquisicao'], '%Y-%m-%d').date()
        
        computador = Computador(
            marca=data['marca'],
            modelo=data['modelo'],
            numero_serie=data['numero_serie'],
            data_aquisicao=data_aquisicao
        )
        
        db.session.add(computador)
        db.session.commit()
        
        return jsonify(computador.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@computador_bp.route('/computadores/<int:id>', methods=['PUT'])
def update_computador(id):
    try:
        computador = Computador.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Nenhum dado fornecido'}), 400
        
        # Verificar se número de série já existe (exceto para o próprio computador)
        if 'numero_serie' in data:
            existing = Computador.query.filter_by(numero_serie=data['numero_serie']).first()
            if existing and existing.id != id:
                return jsonify({'error': 'Número de série já existe'}), 400
        
        # Atualizar campos
        if 'marca' in data:
            computador.marca = data['marca']
        if 'modelo' in data:
            computador.modelo = data['modelo']
        if 'numero_serie' in data:
            computador.numero_serie = data['numero_serie']
        if 'data_aquisicao' in data:
            computador.data_aquisicao = datetime.strptime(data['data_aquisicao'], '%Y-%m-%d').date()
        
        computador.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(computador.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@computador_bp.route('/computadores/<int:id>', methods=['DELETE'])
def delete_computador(id):
    try:
        computador = Computador.query.get_or_404(id)
        
        # Verificar se há manutenções associadas
        if computador.manutencoes:
            return jsonify({'error': 'Não é possível excluir computador com manutenções associadas'}), 400
        
        db.session.delete(computador)
        db.session.commit()
        
        return jsonify({'message': 'Computador excluído com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@computador_bp.route('/computadores/search', methods=['GET'])
def search_computadores():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200
        
        computadores = Computador.query.filter(
            (Computador.marca.contains(query)) |
            (Computador.modelo.contains(query)) |
            (Computador.numero_serie.contains(query))
        ).all()
        
        return jsonify([computador.to_dict() for computador in computadores]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

