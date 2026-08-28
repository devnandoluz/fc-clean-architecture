# FC Clean Architecture

Projeto do curso Full Cycle aplicando Clean Architecture com TypeScript, Sequelize e Express.

Além do código-base do curso, este repositório contém:

- Os 4 use cases da entidade **Product** (`create`, `find`, `list`, `update`), com testes de unidade e de integração para cada um.
- A camada de **API Web** para Product, expondo o use case de listagem em `GET /product`, com teste End-to-End.

## Pré-requisitos

- Node.js 16 ou superior (desenvolvido e validado no Node 24)
- npm

Não é necessário instalar banco de dados: os testes usam **SQLite em memória**, criado e destruído a cada execução.

## Instalação

```bash
npm install
```

## Rodando os testes

O comando principal executa a checagem de tipos (`tsc --noEmit`) e, em seguida, toda a suíte de testes:

```bash
npm test
```

Se a compilação falhar, os testes nem chegam a rodar — isso garante que o projeto está tipado corretamente antes da validação de comportamento.

### Rodando apenas um tipo de teste

Os arquivos seguem uma convenção de nomes que permite filtrar a suíte. O Jest recebe um padrão que é casado contra o caminho do arquivo:

Somente os testes de **unidade** (`*.unit.spec.ts`):

```bash
npx jest unit
```

Somente os testes de **integração** (`*.integration.spec.ts`):

```bash
npx jest integration
```

Somente os testes **End-to-End** (`*.e2e.spec.ts`):

```bash
npx jest e2e
```

### Rodando os testes de uma entidade ou arquivo específico

Todos os testes da entidade Product:

```bash
npx jest src/usecase/product
```

Um arquivo específico:

```bash
npx jest src/usecase/product/list/list.product.unit.spec.ts
```

### Outras opções úteis

Modo watch, reexecutando a cada alteração:

```bash
npx jest --watch
```

Relatório de cobertura:

```bash
npx jest --coverage
```

Saída detalhada, listando o nome de cada teste:

```bash
npx jest --verbose
```

## Estrutura dos testes

| Tipo | Convenção | O que valida |
|---|---|---|
| Unidade | `*.unit.spec.ts` | Lógica de negócio isolada, com repositório mockado (`jest.fn()`) |
| Integração | `*.integration.spec.ts` | Use case + repositório real contra SQLite em memória |
| End-to-End | `*.e2e.spec.ts` | Requisição HTTP real na API via `supertest`, do roteamento ao banco |
| Domínio | `*.spec.ts` | Entidades, factories, services e eventos |

Os testes de integração e E2E sobem um SQLite em memória com `sync({ force: true })` antes de cada teste, então cada caso começa com o banco limpo e a ordem de execução não importa.

## API

Para subir o servidor em modo de desenvolvimento:

```bash
npm run dev
```

A porta padrão é `3000` e pode ser alterada pela variável de ambiente `PORT`.

### `GET /product`

Retorna a lista de produtos cadastrados com status `200`. A rota chama o use case `ListProductUseCase`.

Resposta em JSON (padrão):

```json
{
  "products": [
    { "id": "123", "name": "Product 1", "price": 100 },
    { "id": "456", "name": "Product 2", "price": 200 }
  ]
}
```

A mesma rota devolve XML quando o cliente envia o header `Accept: application/xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <id>123</id>
    <name>Product 1</name>
    <price>100</price>
  </product>
</products>
```

### `GET /customer` e `POST /customer`

Rotas da entidade Customer, implementadas em aula, com o mesmo suporte a JSON e XML na listagem.
