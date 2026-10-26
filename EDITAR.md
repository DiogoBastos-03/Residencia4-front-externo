# Onde mexer — Portal do Fornecedor

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build
```

Revisão: `/_estados` lista todos os estados das telas com link direto (inclusive carregando, erro e vazio, por `?estado=carregando|erro|vazio`). `/_componentes` é a vitrine do design system.

## Texto

Todo texto visível está em `src/shared/strings/`. Nenhum componente tem texto solto.
- `dominio.ts`: o vocabulário do produto ("lista de exigências", "Exigido nas suas 3 obras", motivos de reprovação, os nomes das ações Enviar, Renovar e Reenviar). Trocar um termo aqui troca em todas as telas. Nunca use "workflow".
- `layout.ts`: menu, sidebar e modal de sair.
- `status.ts`: rótulos dos badges (Aprovado, Em análise…) e das tags (Obrigatório, Opcional, Funcionários).
- `pages/*.ts`: os textos de cada tela. `envio.ts` cobre o painel de envio, renovação e reenvio, e `remessa.ts` o painel "Adicionar funcionários".
- `ui.ts`: textos dos componentes base (fechar painel, tentar de novo…).

## Cor, tipografia, raio, sombra e movimento

Tudo fica em `src/app/styles/theme.css`, no bloco `@theme`, igual ao painel interno. Os valores não mudaram.
- **Ação = grafite** (`action-*`): botão primário, controle marcado, foco.
- **Vermelho = identidade** (`primary`): marca, item ativo do menu, contador de Documentos, tag "Funcionários" e os números de vencidos e pendências.
- **Vermelho destrutivo** (`destructive`): só em confirmação destrutiva. O portal não tem nenhuma hoje — "Sair" não é destrutivo.
- Componentes nunca usam cor, raio, sombra ou tamanho de texto cru: só os tokens.

## Marca

Fica em `src/app/brand/`. É a mesma regra do interno, lida por `src/shared/ui/Logo.tsx`: um arquivo com "simbolo" ou "symbol" no nome é só o símbolo; qualquer outro é a logo com o nome. Sem arquivo, aparece o quadrado "JN" com "JotaNunes".

## Dados de demonstração

- `src/mocks/dados.ts` tem tudo: empresa, obras, listas de exigências, tipos de documento, documentos da empresa, funcionários e os arquivos de cada um, a remessa e o histórico. O "hoje" do sistema é `HOJE` (16/09/2026).
- `src/mocks/exemplos.ts`: o que preenche os formulários quando a URL pede exemplo (`?exemplo=valido|invalido` no envio, `?exemplo=1` na remessa). É usado pela `/_estados`.
- Os números das telas **não são digitados**: o contador do menu, as métricas do Início, os "4 de 5 em dia", as pendências por obra e as contagens dos filtros saem dos dados, por `src/entities/lib/`. Mude um status em `dados.ts` e todas as telas acompanham.
- O que a pessoa faz na tela (enviar documento, enviar remessa, salvar contato) altera a store `src/mocks/store.ts`, e todas as telas recalculam. Some no F5, de propósito.
- Regras do modelo:
  - Uma lista só vale para a empresa se o tipo dela (serviço ou material) estiver em `empresa.tipos`. Para ver a regra funcionando, o Edifício Jardins da Torre tem uma lista de material que não aparece.
  - Documento de funcionário é um item com um arquivo por pessoa (`arquivos`), cada um com validade e decisão próprias.

## Quando a API existir

Os hooks de leitura (`src/features/*/hooks/use*.ts`) devolvem `{ data, isLoading, error, refetch }` por meio de `src/mocks/useDatasetQuery.ts`. Troca-se o corpo deles; as telas não mudam. As ações ficam em `useAcoesEnvio`, `useAcoesRemessa` e `useAcoesEmpresa`.

## Acrescentar uma tela

1. **Textos**: crie `src/shared/strings/pages/minhaTela.ts` e registre em `src/shared/strings/index.ts`.
2. **Rota**: acrescente o caminho em `src/shared/lib/paths.ts` (use sempre `paths`, nunca URL à mão).
3. **Regras e componentes**: vão em `src/features/<assunto>/`. Um hook de leitura usa `useDatasetQuery('chave', (ds) => …)`; derivações reaproveitáveis entre telas vão em `src/entities/lib/`. Exporte pelo `index.ts` da feature.
4. **Página**: `src/pages/minha-tela/MinhaTelaPage.tsx` só compõe — `PageHeader` e `AsyncContent`, com esqueleto, erro e vazio.
5. **Roteador**: registre em `src/app/router.tsx`, dentro de `AppLayout` para ter a sidebar. Se for item de menu, acrescente em `src/app/layout/navItems.ts`.
6. **Revisão**: acrescente os estados em `src/pages/estados/catalogo.ts` e os textos deles em `shared/strings/pages/estados.ts`.

## Painéis laterais

O documento (`/documentos/:id`) e a pessoa (`/funcionarios/:id`) abrem em painel sobre a lista. A URL muda e o painel fecha com Esc, com o X ou clicando fora. Ao fechar, o foco volta para a linha que abriu o painel (`focarDepois`, em `src/shared/lib/foco.ts`).

Parâmetros que alteram o painel:
- `?acao=enviar` abre o envio no painel do documento.
- `?reenviar=<tipo>` abre o reenvio no painel da pessoa.
- `?remessa=nova` abre "Adicionar funcionários".

Com um modal aberto sobre o painel, Esc fecha só o modal (`src/shared/lib/useEscapeKey.ts`).
