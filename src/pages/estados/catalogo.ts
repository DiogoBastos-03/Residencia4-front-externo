import { paths } from '@/shared/lib';
import type { ChaveEstado, ChaveGrupoEstado } from '@/shared/strings';

type Entrada = { chave: ChaveEstado; para: string };

const comEstado = (caminho: string, estado: 'carregando' | 'erro' | 'vazio') => `${caminho}${caminho.includes('?') ? '&' : '?'}estado=${estado}`;

/** Todo estado do portal, com link direto. Os textos ficam em shared/strings/pages/estados.ts. */
export const CATALOGO: ReadonlyArray<{ chave: ChaveGrupoEstado; entradas: readonly Entrada[] }> = [
  {
    chave: 'acesso',
    entradas: [
      { chave: 'entrar', para: paths.entrar },
      { chave: 'esqueci', para: paths.esqueciSenha },
    ],
  },
  {
    chave: 'inicio',
    entradas: [
      { chave: 'inicio', para: paths.inicio },
      { chave: 'inicioCarregando', para: comEstado(paths.inicio, 'carregando') },
      { chave: 'inicioErro', para: comEstado(paths.inicio, 'erro') },
      { chave: 'modalSair', para: paths.inicio },
    ],
  },
  {
    chave: 'documentos',
    entradas: [
      { chave: 'documentos', para: paths.documentos },
      { chave: 'docPendentes', para: `${paths.documentos}?filtro=pendentes` },
      { chave: 'docAnalise', para: `${paths.documentos}?filtro=analise` },
      { chave: 'docAprovados', para: `${paths.documentos}?filtro=aprovados` },
      { chave: 'docSemResultado', para: `${paths.documentos}?busca=alvara` },
      { chave: 'docVazio', para: comEstado(paths.documentos, 'vazio') },
      { chave: 'docCarregando', para: comEstado(paths.documentos, 'carregando') },
      { chave: 'docErro', para: comEstado(paths.documentos, 'erro') },
    ],
  },
  {
    chave: 'painelDocumento',
    entradas: [
      { chave: 'painelAprovado', para: paths.documento('cnd-federal') },
      { chave: 'painelVence', para: paths.documento('cndt') },
      { chave: 'painelAnalise', para: paths.documento('pgr') },
      { chave: 'painelPendente', para: paths.documento('pcmso') },
      { chave: 'painelReprovado', para: paths.documento('arq-wellington-duarte-aso') },
      { chave: 'envioVazio', para: paths.documento('fgts', true) },
      { chave: 'envioInvalido', para: `${paths.documento('fgts', true)}&exemplo=invalido` },
      { chave: 'envioPronto', para: `${paths.documento('fgts', true)}&exemplo=valido` },
      { chave: 'reenvio', para: paths.documento('arq-wellington-duarte-aso', true) },
      { chave: 'painelNaoEncontrado', para: paths.documento('documento-inexistente') },
    ],
  },
  {
    chave: 'obras',
    entradas: [
      { chave: 'obras', para: paths.obras },
      { chave: 'obrasVazio', para: comEstado(paths.obras, 'vazio') },
      { chave: 'obrasCarregando', para: comEstado(paths.obras, 'carregando') },
      { chave: 'obrasErro', para: comEstado(paths.obras, 'erro') },
      { chave: 'obraMirante', para: paths.obra('ob-2401') },
      { chave: 'obraJardins', para: paths.obra('ob-2402') },
      { chave: 'obraReserva', para: paths.obra('ob-2404') },
      { chave: 'obraCarregando', para: comEstado(paths.obra('ob-2401'), 'carregando') },
      { chave: 'obraNaoEncontrada', para: paths.obra('obra-inexistente') },
    ],
  },
  {
    chave: 'funcionarios',
    entradas: [
      { chave: 'funcionarios', para: paths.funcionarios },
      { chave: 'funcReprovado', para: `${paths.funcionarios}?situacao=reprovado` },
      { chave: 'funcObra', para: `${paths.funcionarios}?obra=ob-2402` },
      { chave: 'funcSemResultado', para: `${paths.funcionarios}?busca=zacarias` },
      { chave: 'funcVazio', para: comEstado(paths.funcionarios, 'vazio') },
      { chave: 'funcCarregando', para: comEstado(paths.funcionarios, 'carregando') },
      { chave: 'funcErro', para: comEstado(paths.funcionarios, 'erro') },
      { chave: 'pessoaReprovada', para: paths.funcionario('wellington-duarte') },
      { chave: 'pessoaPendente', para: paths.funcionario('rafael-barbosa') },
      { chave: 'pessoaAprovada', para: paths.funcionario('jose-souza') },
      { chave: 'pessoaReenvio', para: paths.funcionario('wellington-duarte', 'aso') },
      { chave: 'pessoaNaoEncontrada', para: paths.funcionario('pessoa-inexistente') },
    ],
  },
  {
    chave: 'remessa',
    entradas: [
      { chave: 'remessaVazia', para: paths.novaRemessa() },
      { chave: 'remessaExemplo', para: `${paths.novaRemessa('ob-2401')}&exemplo=1` },
    ],
  },
  {
    chave: 'historico',
    entradas: [
      { chave: 'historico', para: paths.historico },
      { chave: 'historicoVazio', para: comEstado(paths.historico, 'vazio') },
      { chave: 'historicoCarregando', para: comEstado(paths.historico, 'carregando') },
      { chave: 'historicoErro', para: comEstado(paths.historico, 'erro') },
    ],
  },
  {
    chave: 'empresa',
    entradas: [
      { chave: 'empresa', para: paths.empresa },
      { chave: 'empresaCarregando', para: comEstado(paths.empresa, 'carregando') },
      { chave: 'empresaErro', para: comEstado(paths.empresa, 'erro') },
    ],
  },
  {
    chave: 'outros',
    entradas: [
      { chave: 'naoEncontrada', para: '/pagina-inexistente' },
      { chave: 'componentes', para: paths.componentes },
    ],
  },
];
