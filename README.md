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




---

**Versão**: 1.0  
**Desenvolvido**: Agosto 2025  
**Linguagens**: Python, HTML, CSS, JavaScript

