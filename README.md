# Sistema de Manutenção de Computadores

Sistema web completo para gerenciamento de histórico de manutenção de computadores, desenvolvido com Flask (Python) no backend e HTML5/CSS3/JavaScript no frontend.

## Características Principais

- **Gestão completa de manutenções**: Registro detalhado de manutenções com histórico completo
- **Controle de peças**: Gerenciamento de estoque e uso de peças
- **Gestão de funcionários**: Cadastro e controle de técnicos responsáveis
- **Categorização de problemas**: Organização por tipos de problemas
- **Interface responsiva**: Compatível com desktop, tablet e mobile
- **API RESTful**: Backend com endpoints organizados e documentados

## Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para banco de dados
- **Flask-CORS**: Suporte a CORS para integração frontend/backend
- **SQLite**: Banco de dados (pode ser facilmente alterado)

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com Flexbox/Grid
- **JavaScript ES6+**: Interatividade e consumo de API
- **Font Awesome**: Ícones
- **Design responsivo**: Mobile-first approach

## Estrutura do Projeto

```
sistema_manutencao/
├── src/
│   ├── main.py                 # Aplicação principal Flask
│   ├── models/                 # Modelos de dados
│   │   ├── __init__.py
│   │   ├── computador.py
│   │   ├── funcionario.py
│   │   ├── problema.py
│   │   ├── peca.py
│   │   └── manutencao.py
│   ├── routes/                 # Rotas da API
│   │   ├── computador.py
│   │   ├── funcionario.py
│   │   ├── problema.py
│   │   ├── peca.py
│   │   └── manutencao.py
│   └── static/                 # Arquivos estáticos
│       ├── index.html
│       ├── styles.css
│       └── script.js
├── venv/                       # Ambiente virtual Python
├── MANUAL_USUARIO.md           # Manual do usuário
└── README.md                   # Este arquivo
```

## Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes Python)

### Passos de Instalação

1. **Clone ou baixe o projeto**
```bash
cd C:\Users\dell\Documents\frontend_site\sistema_manutencao
```

2. **Ative o ambiente virtual**
```bash
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Instale as dependências**
```bash
pip install flask flask-cors flask-sqlalchemy
```

4. **Execute a aplicação**
```bash
cd src
python main.py
```

5. **Acesse o sistema**
- Abra o navegador e acesse: `http://localhost:5000`

## API Endpoints

### Computadores
- `GET /api/computadores` - Listar todos os computadores
- `POST /api/computadores` - Criar novo computador
- `GET /api/computadores/{id}` - Obter computador específico
- `PUT /api/computadores/{id}` - Atualizar computador
- `DELETE /api/computadores/{id}` - Excluir computador

### Funcionários
- `GET /api/funcionarios` - Listar todos os funcionários
- `POST /api/funcionarios` - Criar novo funcionário
- `GET /api/funcionarios/{id}` - Obter funcionário específico
- `PUT /api/funcionarios/{id}` - Atualizar funcionário
- `DELETE /api/funcionarios/{id}` - Excluir funcionário

### Problemas
- `GET /api/problemas` - Listar todos os problemas
- `POST /api/problemas` - Criar novo problema
- `GET /api/problemas/{id}` - Obter problema específico
- `PUT /api/problemas/{id}` - Atualizar problema
- `DELETE /api/problemas/{id}` - Excluir problema

### Peças
- `GET /api/pecas` - Listar todas as peças
- `POST /api/pecas` - Criar nova peça
- `GET /api/pecas/{id}` - Obter peça específica
- `PUT /api/pecas/{id}` - Atualizar peça
- `DELETE /api/pecas/{id}` - Excluir peça
- `GET /api/pecas/disponiveis` - Listar peças disponíveis

### Manutenções
- `GET /api/manutencoes` - Listar todas as manutenções
- `POST /api/manutencoes` - Criar nova manutenção
- `GET /api/manutencoes/{id}` - Obter manutenção específica
- `PUT /api/manutencoes/{id}` - Atualizar manutenção
- `DELETE /api/manutencoes/{id}` - Excluir manutenção

## Modelos de Dados

### Computador
- `id`: Identificador único
- `marca`: Marca do computador
- `modelo`: Modelo do computador
- `numero_serie`: Número de série único
- `data_aquisicao`: Data de aquisição

### Funcionário
- `id`: Identificador único
- `nome`: Nome completo
- `cargo`: Cargo/função
- `departamento`: Departamento de trabalho

### Problema
- `id`: Identificador único
- `descricao`: Descrição do problema
- `categoria`: Categoria (Hardware, Software, Rede, etc.)

### Peça
- `id`: Identificador único
- `nome_peca`: Nome da peça
- `numero_serie_peca`: Número de série (opcional)
- `fabricante`: Fabricante da peça
- `custo`: Custo da peça
- `data_aquisicao_peca`: Data de aquisição
- `manutencao_id`: ID da manutenção (se em uso)

### Manutenção
- `id`: Identificador único
- `computador_id`: ID do computador
- `funcionario_id`: ID do funcionário responsável
- `problema_id`: ID do problema
- `data_manutencao`: Data e hora da manutenção
- `tipo_manutencao`: Tipo (Preventiva, Corretiva, Upgrade)
- `descricao_problema`: Descrição detalhada
- `solucao_aplicada`: Solução implementada

## Funcionalidades do Frontend

### Dashboard
- Estatísticas gerais do sistema
- Últimas manutenções realizadas
- Contadores dinâmicos

### Gestão de Dados
- Formulários modais para CRUD
- Validação de dados em tempo real
- Busca e filtros avançados
- Tabelas responsivas com ações

### Interface do Usuário
- Design moderno e intuitivo
- Navegação fluida entre seções
- Feedback visual para ações
- Notificações toast para status

## Personalização

### Alterando o Banco de Dados
Para usar PostgreSQL ou MySQL, modifique a configuração em `main.py`:

```python
# Para PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/dbname'

# Para MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@localhost/dbname'
```

### Customizando a Interface
- **Cores**: Modifique as variáveis CSS em `styles.css`
- **Layout**: Ajuste a estrutura HTML em `index.html`
- **Funcionalidades**: Adicione novos recursos em `script.js`

## Segurança

### Implementadas
- Validação de dados no frontend e backend
- Sanitização de entradas
- Estrutura de dados consistente
- CORS configurado adequadamente

### Recomendações para Produção
- Implementar autenticação de usuários
- Usar HTTPS
- Configurar rate limiting
- Implementar logs de auditoria
- Usar banco de dados robusto (PostgreSQL/MySQL)

## Manutenção e Backup

### Backup do Banco de Dados
```bash
# SQLite
cp database.db backup_database_$(date +%Y%m%d).db

# PostgreSQL
pg_dump dbname > backup_$(date +%Y%m%d).sql

# MySQL
mysqldump dbname > backup_$(date +%Y%m%d).sql
```

### Logs
Os logs da aplicação são exibidos no console. Para produção, configure logging adequado:

```python
import logging
logging.basicConfig(level=logging.INFO)
```

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste thoroughly
5. Submeta um pull request

## Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e comerciais.

## Suporte

Para dúvidas técnicas ou problemas:
- Consulte a documentação
- Verifique os logs de erro
- Teste em ambiente de desenvolvimento

---

**Versão**: 1.0  
**Desenvolvido**: Agosto 2025  
**Linguagens**: Python, HTML, CSS, JavaScript

