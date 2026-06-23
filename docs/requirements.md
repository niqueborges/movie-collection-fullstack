# Desafio 2: API de Filmes (Grupo) - parte 2

Nesse projeto back-end, sera desenvolvido uma API de filmes, onde usuarios podem visualizar filmes, adicionar a sua lista pessoal e avaliar com notas.

- **Disponibilizado**: 22/06/2026
- **Data de entrega**: 29/06/2026 ate as 17:30

---

## Entidades do Sistema

- **Usuarios**: Gerenciamento de contas de usuarios
- **Filmes**: Catalogo de filmes disponiveis
- **Lista de Filmes**: Lista pessoal de filmes de cada usuario
- **Notas**: Avaliacoes dos usuarios para os filmes

---

## Funcionalidades e Regras de Negocio

### Autenticacao e Usuarios

- Deve ser possivel fazer um cadastro no aplicativo
- Deve cadastrar nome, email e senha do usuario
- Email deve ser unico no sistema
- Senha deve ser criptografada antes de salvar no banco
- Senha deve ter no minimo 6 caracteres
- Deve ser possivel fazer login no aplicativo
- Deve ser retornado um JWT valido
- Token JWT deve conter o ID e email
- Token deve ter expiracao configuravel
- Deve ser possivel atualizar dados do perfil do usuario
- Usuario so pode atualizar seu proprio perfil

### Gestao de Filmes

- Deve ser possivel cadastrar filmes
- Deve cadastrar titulo, descricao, ano de lancamento, genero e duracao
- Ano de lancamento deve ser um valor valido (1800 ate ano atual)
- Duracao deve ser em segundos
- Deve ser possivel listar todos os filmes
  - Deve ter paginacao
  - Deve ter busca por titulo
  - Deve ter filtro por genero
  - Deve ter filtro por ano de lancamento
  - Deve ordenar por titulo, ano ou nota media
  - Endpoint deve ser publico (nao requer autenticacao)
- Deve ser possivel visualizar detalhes de um filme especifico
  - Deve mostrar todas as informacoes do filme
  - Deve mostrar a nota media do filme
  - Deve mostrar o total de avaliacoes
  - Endpoint deve ser publico (nao requer autenticacao)
- Deve ser possivel atualizar informacoes de um filme
  - Deve validar os mesmos campos do cadastro
- Deve ser possivel deletar um filme
  - Ao deletar um filme, deve remover das listas dos usuarios
  - Ao deletar um filme, deve remover todas as avaliacoes associadas

### Lista Pessoal de Filmes

- Deve ser possivel adicionar um filme a lista pessoal
  - Usuario autenticado pode adicionar filmes a sua lista
  - Nao deve permitir adicionar o mesmo filme duas vezes na lista
  - Filme deve existir no catalogo
- Deve ser possivel listar os filmes da lista pessoal
  - Deve listar apenas os filmes do usuario autenticado
  - Deve ter paginacao
  - Deve incluir informacoes completas de cada filme
- Deve ser possivel remover um filme da lista pessoal
  - Usuario so pode remover filmes da sua propria lista
  - Ao remover, nao deve afetar o filme no catalogo

### Sistema de Avaliacoes

- Deve ser possivel avaliar um filme
  - Nota deve ser de 0 a 10 (pode ser decimal, ex: 8.5)
  - Usuario autenticado pode avaliar filmes
  - Usuario nao pode avaliar o mesmo filme mais de uma vez (deve atualizar a nota existente)
  - Filme deve existir no catalogo
- Deve ser possivel visualizar todas as avaliacoes de um usuario
  - Deve listar apenas as avaliacoes do usuario autenticado
  - Deve ter paginacao
  - Deve incluir informacoes do filme avaliado
- Deve ser possivel atualizar uma avaliacao
  - Usuario so pode atualizar suas proprias avaliacoes
  - Deve validar a nova nota
  - Ao atualizar, deve recalcular a nota media do filme
- Deve ser possivel deletar uma avaliacao
  - Usuario so pode deletar suas proprias avaliacoes
  - Ao deletar, deve recalcular a nota media do filme

---

## Importacao e Exportacao (Opcional)

- Deve ser possivel exportar a lista pessoal em formato CSV ou JSON
  - Deve exportar apenas os filmes do usuario autenticado
  - Deve ser gerado um nome aleatorio e unico para o arquivo
  - Deve enviar o arquivo para o e-mail do usuario
- Deve ser possivel exportar as avaliacoes do usuario em formato CSV ou JSON
  - Deve exportar apenas as avaliacoes do usuario autenticado
  - Deve ser gerado um nome aleatorio e unico para o arquivo
  - Deve enviar o arquivo para o e-mail do usuario
- Deve ser possivel importar filmes em formato CSV ou JSON
  - Deve receber um arquivo CSV ou JSON
  - Deve ter todas as informacoes necessarias para a criacao de um filme

> Veja que nao especificamos os campos do banco de dados, deve ser modelado de maneira a suprir todas as necessidades de negocio.

---

## Ferramentas Obrigatorias

- TypeScript
- NestJS
- Banco de dados SQL

---

## Boas Praticas com TypeScript

- Utilize Interfaces para a estrutura de dados
- Utilize tipagens nos parametros e retornos de funcoes (DTOs para NestJS)
- Evite o uso de `any`
- Utilize nomes de variaveis e funcoes em ingles de forma clara e consistente

---

## Boas Praticas de Arquitetura

- Mappers para transformacao de dados
- Siga os principios de codigo limpo e SOLID

---

## Scripts Necessarios

```bash
npm run start:dev   # Executar em modo desenvolvimento
npm run build       # Compilar o projeto
npm run start:prod  # Executar em modo producao
npm run test        # Executar testes
npm run test:cov    # Executar testes com cobertura
```

---

## Testes

Para esse projeto e necessaria uma cobertura de testes unitarios.

---

## Docker (Opcional)

- Criar um `Dockerfile`
- Criar um `docker-compose.yml` que suba somente o banco de dados com `docker compose up`
- Manter o `.env.example` e `docker-compose.yml` com as variaveis equalizados

---

## Logs e Monitoramento

- Logs descritivos: utilizar logs de entrada, saida e erro nos controllers e services
- Registrar detalhadamente todas as interacoes (solicitacoes e respostas) com a API
- Utilizar os logs do proprio NestJS

---

## Documentacao

Criar um arquivo `README.md` claro que:

- Resuma o objetivo do projeto
- Liste as funcionalidades principais (endpoints e suas acoes)
- Forneca instrucoes simples sobre como instalar e executar o projeto
- Explique como configurar as variaveis de ambiente
- Inclua exemplos de requisicoes para os principais endpoints

---

## Git e GitHub

- Criar um repositorio no GitHub
- Seguir um padrao de commits consistente (Conventional Commits: `feat:`, `fix:`, etc.)
- Commits curtos, descritivos e em ingles
- Adicionar instrutores e SM como membros ate 29/06/2026 ate as 17:30:
  - Ihago
  - Ariel
  - Jailson
  - William
  - Antonio

---

## Links Relevantes

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Os 7 principios do Clean Code](https://blog.betrybe.com/tecnologia/clean-code/)
- [README.so - Gerador de README](https://readme.so/)
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Docker - Writing a Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)
- [Docker e Docker Compose: um guia para iniciantes](https://www.alura.com.br/artigos/docker-e-docker-compose)

---

## Dicas

- Cuidado com a arquitetura do projeto!
- Nao deixe o git/GitHub para a ultima hora!
- Nao fique com duvidas, estamos aqui para ajudar!
