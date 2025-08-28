from flask import Blueprint, request, jsonify
from src.models import db
from src.models.manutencao import Manutencao
from src.models.peca import Peca
from datetime import datetime

manutencao_bp = Blueprint('manutencao', __name__)

@manutencao_bp.route('/manutencoes', methods=['GET'])
def get_manutencoes():
    try:
        # Parâmetros de filtro
        computador_id = request.args.get('computador_id')
        funcionario_id = request.args.get('funcionario_id')
        tipo = request.args.get('tipo')
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = Manutencao.query
        
        # Aplicar filtros
        if computador_id:
            query = query.filter_by(computador_id=computador_id)
        if funcionario_id:
            query = query.filter_by(funcionario_id=funcionario_id)
        if tipo:
            query = query.filter_by(tipo_manutencao=tipo)
        if data_inicio:
            data_inicio_obj = datetime.strptime(data_inicio, '%Y-%m-%d')
            query = query.filter(Manutencao.data_manutencao >= data_inicio_obj)
        if data_fim:
            data_fim_obj = datetime.strptime(data_fim, '%Y-%m-%d')
            query = query.filter(Manutencao.data_manutencao <= data_fim_obj)
        
        manutencoes = query.order_by(Manutencao.data_manutencao.desc()).all()
        return jsonify([manutencao.to_dict() for manutencao in manutencoes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@manutencao_bp.route('/manutencoes/<int:id>', methods=['GET'])
def get_manutencao(id):
    try:
        manutencao = Manutencao.query.get_or_404(id)
        return jsonify(manutencao.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@manutencao_bp.route('/manutencoes', methods=['POST'])
def create_manutencao():
    try:
        data = request.get_json()
        
        # Validação básica
        required_fields = ['computador_id', 'funcionario_id', 'problema_id', 'data_manutencao', 
                          'tipo_manutencao', 'descricao_problema', 'solucao_aplicada']
        if not data or not all(k in data for k in required_fields):
            return jsonify({'error': f'Dados obrigatórios: {", ".join(required_fields)}'}), 400
        
        # Converter data/hora
        data_manutencao = datetime.strptime(data['data_manutencao'], '%Y-%m-%dT%H:%M')
        
        manutencao = Manutencao(
            computador_id=data['computador_id'],
            funcionario_id=data['funcionario_id'],
            problema_id=data['problema_id'],
            data_manutencao=data_manutencao,
            tipo_manutencao=data['tipo_manutencao'],
            descricao_problema=data['descricao_problema'],
            solucao_aplicada=data['solucao_aplicada']
        )
        
        db.session.add(manutencao)
        db.session.flush()  # Para obter o ID da manutenção
        
        # Associar peças se fornecidas
        if 'pecas_ids' in data and data['pecas_ids']:
            for peca_id in data['pecas_ids']:
                peca = Peca.query.get(peca_id)
                if peca:
                    peca.manutencao_id = manutencao.id
        
        db.session.commit()
        
        return jsonify(manutencao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@manutencao_bp.route('/manutencoes/<int:id>', methods=['PUT'])
def update_manutencao(id):
    try:
        manutencao = Manutencao.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Nenhum dado fornecido'}), 400
        
        # Atualizar campos
        if 'computador_id' in data:
            manutencao.computador_id = data['computador_id']
        if 'funcionario_id' in data:
            manutencao.funcionario_id = data['funcionario_id']
        if 'problema_id' in data:
            manutencao.problema_id = data['problema_id']
        if 'data_manutencao' in data:
            manutencao.data_manutencao = datetime.strptime(data['data_manutencao'], '%Y-%m-%dT%H:%M')
        if 'tipo_manutencao' in data:
            manutencao.tipo_manutencao = data['tipo_manutencao']
        if 'descricao_problema' in data:
            manutencao.descricao_problema = data['descricao_problema']
        if 'solucao_aplicada' in data:
            manutencao.solucao_aplicada = data['solucao_aplicada']
        
        # Atualizar peças associadas
        if 'pecas_ids' in data:
            # Remover associações antigas
            for peca in manutencao.pecas:
                peca.manutencao_id = None
            
            # Adicionar novas associações
            if data['pecas_ids']:
                for peca_id in data['pecas_ids']:
                    peca = Peca.query.get(peca_id)
                    if peca:
                        peca.manutencao_id = manutencao.id
        
        manutencao.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(manutencao.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@manutencao_bp.route('/manutencoes/<int:id>', methods=['DELETE'])
def delete_manutencao(id):
    try:
        manutencao = Manutencao.query.get_or_404(id)
        
        # Desassociar peças antes de excluir
        for peca in manutencao.pecas:
            peca.manutencao_id = None
        
        db.session.delete(manutencao)
        db.session.commit()
        
        return jsonify({'message': 'Manutenção excluída com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@manutencao_bp.route('/manutencoes/computador/<int:computador_id>', methods=['GET'])
def get_manutencoes_por_computador(computador_id):
    try:
        manutencoes = Manutencao.query.filter_by(computador_id=computador_id)\
                                     .order_by(Manutencao.data_manutencao.desc()).all()
        return jsonify([manutencao.to_dict() for manutencao in manutencoes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@manutencao_bp.route('/manutencoes/tipos', methods=['GET'])
def get_tipos_manutencao():
    try:
        tipos = db.session.query(Manutencao.tipo_manutencao).distinct().all()
        return jsonify([tipo[0] for tipo in tipos]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@manutencao_bp.route('/manutencoes/relatorio', methods=['GET'])
def get_relatorio_manutencoes():
    try:
        # Estatísticas gerais
        total_manutencoes = Manutencao.query.count()
        
        # Manutenções por tipo
        tipos = db.session.query(Manutencao.tipo_manutencao, 
                                db.func.count(Manutencao.id))\
                          .group_by(Manutencao.tipo_manutencao).all()
        
        # Manutenções por mês (últimos 12 meses)
        from sqlalchemy import extract
        manutencoes_por_mes = db.session.query(
            extract('year', Manutencao.data_manutencao).label('ano'),
            extract('month', Manutencao.data_manutencao).label('mes'),
            db.func.count(Manutencao.id).label('total')
        ).group_by('ano', 'mes').order_by('ano', 'mes').limit(12).all()
        
        relatorio = {
            'total_manutencoes': total_manutencoes,
            'por_tipo': [{'tipo': tipo[0], 'quantidade': tipo[1]} for tipo in tipos],
            'por_mes': [{'ano': int(item.ano), 'mes': int(item.mes), 'total': item.total} 
                       for item in manutencoes_por_mes]
        }
        
        return jsonify(relatorio), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

