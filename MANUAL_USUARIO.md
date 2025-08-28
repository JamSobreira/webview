# Manual do Usuário - Sistema de Manutenção de Computadores

## Visão Geral

O Sistema de Manutenção de Computadores é uma aplicação web completa desenvolvida para gerenciar o histórico de manutenções, peças, problemas e funcionários responsáveis pela manutenção de equipamentos de informática.

## Funcionalidades Principais

### 1. Dashboard
- **Visão geral**: Apresenta estatísticas gerais do sistema
- **Contadores**: Total de computadores, manutenções realizadas, peças cadastradas e funcionários
- **Últimas manutenções**: Lista das 5 manutenções mais recentes

### 2. Gerenciamento de Computadores
- **Cadastro**: Registrar novos computadores com marca, modelo, número de série e data de aquisição
- **Listagem**: Visualizar todos os computadores cadastrados
- **Busca**: Pesquisar computadores por marca, modelo ou número de série
- **Edição**: Modificar informações de computadores existentes
- **Exclusão**: Remover computadores do sistema

### 3. Gerenciamento de Funcionários
- **Cadastro**: Registrar funcionários com nome, cargo e departamento
- **Listagem**: Visualizar todos os funcionários cadastrados
- **Busca**: Pesquisar funcionários por nome, cargo ou departamento
- **Edição**: Modificar informações de funcionários existentes
- **Exclusão**: Remover funcionários do sistema

### 4. Gerenciamento de Problemas
- **Cadastro**: Registrar tipos de problemas com descrição e categoria
- **Categorias disponíveis**: Hardware, Software, Rede, Sistema Operacional, Periféricos
- **Listagem**: Visualizar todos os problemas cadastrados
- **Busca**: Pesquisar problemas por descrição ou categoria
- **Edição**: Modificar informações de problemas existentes
- **Exclusão**: Remover problemas do sistema

### 5. Gerenciamento de Peças
- **Cadastro**: Registrar peças com nome, fabricante, custo e data de aquisição
- **Status**: Controle automático de disponibilidade (Disponível/Em Uso)
- **Listagem**: Visualizar todas as peças cadastradas
- **Busca**: Pesquisar peças por nome ou fabricante
- **Edição**: Modificar informações de peças existentes
- **Exclusão**: Remover peças do sistema

### 6. Histórico de Manutenções
- **Cadastro completo**: Registrar manutenções com:
  - Computador atendido
  - Funcionário responsável
  - Problema identificado
  - Data e hora da manutenção
  - Tipo de manutenção (Preventiva, Corretiva, Upgrade)
  - Descrição detalhada do problema
  - Solução aplicada
- **Filtros avançados**: Por computador, tipo de manutenção e período
- **Visualização detalhada**: Ver todos os detalhes de uma manutenção específica
- **Busca**: Pesquisar manutenções por computador, tipo ou funcionário
- **Edição**: Modificar informações de manutenções existentes
- **Exclusão**: Remover manutenções do sistema

## Como Usar o Sistema

### Primeiro Acesso
1. Acesse o sistema através do navegador web
2. Comece cadastrando os dados básicos:
   - **Funcionários**: Cadastre os técnicos responsáveis pelas manutenções
   - **Computadores**: Registre os equipamentos que serão mantidos
   - **Problemas**: Defina os tipos de problemas mais comuns
   - **Peças**: Cadastre as peças disponíveis no estoque

### Registrando uma Manutenção
1. Acesse a seção "Manutenções"
2. Clique em "Nova Manutenção"
3. Preencha todos os campos obrigatórios:
   - Selecione o computador
   - Escolha o funcionário responsável
   - Identifique o problema
   - Defina data/hora e tipo de manutenção
   - Descreva o problema e a solução aplicada
4. Clique em "Salvar"

### Consultando o Histórico
1. Use o Dashboard para uma visão geral
2. Acesse "Manutenções" para ver o histórico completo
3. Use os filtros para encontrar manutenções específicas:
   - Por computador
   - Por tipo de manutenção
   - Por período (data início/fim)
4. Clique no ícone de "olho" para ver detalhes completos

### Funcionalidades de Busca
- Cada seção possui um campo de busca no topo
- A busca é realizada em tempo real conforme você digita
- Busca por múltiplos campos simultaneamente

## Interface do Sistema

### Navegação
- **Header**: Contém o logo e botões de navegação para todas as seções
- **Seções**: Dashboard, Computadores, Manutenções, Peças, Funcionários, Problemas
- **Botões de ação**: Cada seção possui botões para adicionar novos registros

### Tabelas
- **Listagem**: Todos os dados são apresentados em tabelas organizadas
- **Ações**: Cada linha possui botões para editar, excluir ou visualizar detalhes
- **Paginação**: Automática para grandes volumes de dados

### Formulários
- **Modais**: Todos os formulários abrem em janelas modais
- **Validação**: Campos obrigatórios são validados automaticamente
- **Feedback**: Mensagens de sucesso/erro são exibidas após cada ação

## Recursos Técnicos

### Responsividade
- Interface adaptável para desktop, tablet e mobile
- Navegação otimizada para dispositivos touch

### Performance
- Carregamento rápido das páginas
- Busca em tempo real
- Interface fluida e responsiva

### Segurança
- Validação de dados no frontend e backend
- Proteção contra injeção de código
- Estrutura de dados consistente

## Dicas de Uso

1. **Organize os dados**: Cadastre primeiro funcionários, computadores e problemas antes de registrar manutenções
2. **Use descrições claras**: Seja específico nas descrições de problemas e soluções
3. **Mantenha atualizado**: Registre as manutenções logo após sua realização
4. **Use os filtros**: Aproveite os recursos de busca e filtro para encontrar informações rapidamente
5. **Backup regular**: Mantenha backups regulares dos dados do sistema

## Suporte

Para dúvidas ou problemas técnicos, consulte a documentação técnica ou entre em contato com o administrador do sistema.

---

**Versão**: 1.0  
**Data**: Agosto 2025  
**Desenvolvido com**: Flask (Python), HTML5, CSS3, JavaScript

