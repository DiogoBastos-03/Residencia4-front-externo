import type {
  ArquivoFuncionario,
  DocumentoEmpresa,
  Empresa,
  EventoHistorico,
  Funcionario,
  ListaExigencias,
  Obra,
  Remessa,
  TipoDocumento,
} from '@/entities';

/**
 * Dados de demonstração do Portal do Fornecedor, fixos (sem Math.random).
 * Os números que aparecem nas telas não são digitados: saem destes dados por
 * src/entities/lib — contador do menu, métricas do Início e listas sempre fecham entre si.
 */

/** "Hoje" do protótipo: quarta-feira, 16 de setembro de 2026. */
export const HOJE = '2026-09-16';
export const AGORA = '2026-09-16T14:30';

export const empresa: Empresa = {
  razaoSocial: 'Construtora Exemplo Ltda.',
  nome: 'Construtora Exemplo',
  cnpj: '12345678000190',
  inscricaoEstadual: '0987654-32',
  endereco: 'Rua da Aurora, 1200 — Recife/PE',
  atividade: 'Construção civil — alvenaria',
  fornecedorDesde: '2026-01-10',
  tipos: ['servico'],
  emailNotificacoes: 'contato@construtoraexemplo.com.br',
  responsavel: 'Ana Beatriz Carvalho',
  telefone: '8133224455',
};

export const tiposDocumento: readonly TipoDocumento[] = [
  { id: 'contrato-social', nome: 'Contrato Social consolidado' },
  { id: 'cartao-cnpj', nome: 'Cartão CNPJ' },
  { id: 'cnd-federal', nome: 'Certidão Negativa de Débitos Federais', curto: 'CND Federal' },
  { id: 'fgts', nome: 'Certidão de Regularidade do FGTS', curto: 'FGTS' },
  { id: 'cndt', nome: 'Certidão Negativa de Débitos Trabalhistas', curto: 'CNDT' },
  { id: 'atestado-capacidade', nome: 'Atestado de Capacidade Técnica' },
  { id: 'pgr', nome: 'PGR – Programa de Gerenciamento de Riscos', curto: 'PGR' },
  { id: 'pcmso', nome: 'PCMSO – Controle Médico de Saúde Ocupacional', curto: 'PCMSO' },
  { id: 'apolice-rc', nome: 'Apólice de Seguro de Responsabilidade Civil', curto: 'Apólice' },
  { id: 'crea', nome: 'Certidão de Registro no CREA', curto: 'CREA' },
  { id: 'dados-bancarios', nome: 'Comprovante de dados bancários' },
  { id: 'aso', nome: 'ASO — Atestado de Saúde Ocupacional', curto: 'ASO' },
  { id: 'epi', nome: 'Ficha de entrega de EPI', curto: 'Ficha de EPI' },
  { id: 'rg-cnh', nome: 'RG ou CNH' },
  { id: 'nr35', nome: 'Certificado NR-35 — Trabalho em altura', curto: 'NR-35' },
];

const SEM_DATA = { validade: 'semValidade' } as const;
const COM_DATA = { validade: 'comData' } as const;

export const listas: readonly ListaExigencias[] = [
  {
    id: 'hab-servico',
    nome: 'Habilitação — fornecedor de serviço',
    tipo: 'servico',
    itens: [
      { tipoDocumentoId: 'contrato-social', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...SEM_DATA },
      { tipoDocumentoId: 'cartao-cnpj', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...SEM_DATA },
      { tipoDocumentoId: 'cnd-federal', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...COM_DATA },
      { tipoDocumentoId: 'fgts', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...COM_DATA },
      { tipoDocumentoId: 'cndt', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...COM_DATA },
      { tipoDocumentoId: 'atestado-capacidade', escopo: 'empresa', obrigatoriedade: 'opcional', ...SEM_DATA },
    ],
  },
  {
    id: 'seg-trabalho',
    nome: 'Segurança do trabalho em obra',
    tipo: 'servico',
    itens: [
      { tipoDocumentoId: 'pgr', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...COM_DATA },
      { tipoDocumentoId: 'pcmso', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...COM_DATA },
      { tipoDocumentoId: 'apolice-rc', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...COM_DATA },
      { tipoDocumentoId: 'crea', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...COM_DATA },
      { tipoDocumentoId: 'aso', escopo: 'funcionario', obrigatoriedade: 'obrigatorio', ...COM_DATA },
      { tipoDocumentoId: 'epi', escopo: 'funcionario', obrigatoriedade: 'obrigatorio', ...SEM_DATA },
      { tipoDocumentoId: 'rg-cnh', escopo: 'funcionario', obrigatoriedade: 'obrigatorio', ...SEM_DATA },
      { tipoDocumentoId: 'nr35', escopo: 'funcionario', obrigatoriedade: 'opcional', ...COM_DATA },
    ],
  },
  // De material: está no Edifício Jardins da Torre, mas não aparece para um fornecedor só de serviço.
  {
    id: 'hab-material',
    nome: 'Habilitação — fornecedor de material',
    tipo: 'material',
    itens: [
      { tipoDocumentoId: 'contrato-social', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...SEM_DATA },
      { tipoDocumentoId: 'cartao-cnpj', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...SEM_DATA },
      { tipoDocumentoId: 'dados-bancarios', escopo: 'empresa', obrigatoriedade: 'obrigatorio', ...COM_DATA },
    ],
  },
];

export const obras: readonly Obra[] = [
  {
    id: 'ob-2401',
    codigo: 'OB-2401',
    nome: 'Residencial Mirante do Parque',
    cidade: 'Recife',
    uf: 'PE',
    situacao: 'emExecucao',
    servicoContratado: 'Alvenaria e acabamento',
    inicio: '2026-01-01',
    fim: '2027-12-01',
    listaIds: ['hab-servico', 'seg-trabalho'],
  },
  {
    id: 'ob-2402',
    codigo: 'OB-2402',
    nome: 'Edifício Jardins da Torre',
    cidade: 'Recife',
    uf: 'PE',
    situacao: 'emExecucao',
    servicoContratado: 'Acabamento',
    inicio: '2026-05-01',
    fim: '2027-03-01',
    listaIds: ['hab-servico', 'hab-material'],
  },
  {
    id: 'ob-2404',
    codigo: 'OB-2404',
    nome: 'Reserva das Águas',
    cidade: 'Olinda',
    uf: 'PE',
    situacao: 'planejamento',
    servicoContratado: 'Alvenaria',
    inicio: '2026-10-01',
    fim: '2028-06-01',
    listaIds: ['hab-servico'],
  },
];

const MARINA = 'Marina Duarte';
const RODRIGO = 'Rodrigo Alves';
const CAMILA = 'Camila Rocha';

export const documentos: readonly DocumentoEmpresa[] = [
  {
    id: 'doc-contrato-social',
    tipoDocumentoId: 'contrato-social',
    status: 'aprovado',
    arquivo: { nome: 'contrato-social-construtora-exemplo.pdf', tamanhoKb: 2140, enviadoEm: '2026-01-10T10:05' },
    decisao: { por: MARINA, em: '2026-01-12T10:30' },
    anteriores: [],
  },
  {
    id: 'doc-cartao-cnpj',
    tipoDocumentoId: 'cartao-cnpj',
    status: 'aprovado',
    arquivo: { nome: 'cartao-cnpj-construtora-exemplo.pdf', tamanhoKb: 180, enviadoEm: '2026-01-10T10:12' },
    decisao: { por: MARINA, em: '2026-01-12T10:40' },
    anteriores: [],
  },
  {
    id: 'doc-cnd-federal',
    tipoDocumentoId: 'cnd-federal',
    status: 'aprovado',
    validade: '2027-03-12',
    arquivo: { nome: 'cnd-federais-2026.pdf', tamanhoKb: 900, enviadoEm: '2026-08-25T09:10' },
    decisao: { por: MARINA, em: '2026-08-25T16:20' },
    anteriores: [
      { arquivo: 'cnd-federais-2026-v1.pdf', enviadoEm: '2026-08-18', resultado: 'reprovado' },
      { arquivo: 'cnd-federais-2025.pdf', enviadoEm: '2025-09-12', resultado: 'aprovado' },
    ],
  },
  {
    id: 'doc-fgts',
    tipoDocumentoId: 'fgts',
    status: 'aprovado',
    validade: '2026-09-10',
    arquivo: { nome: 'crf-fgts-2026-03.pdf', tamanhoKb: 160, enviadoEm: '2026-03-12T15:40' },
    decisao: { por: MARINA, em: '2026-03-13T09:15' },
    anteriores: [],
  },
  {
    id: 'doc-cndt',
    tipoDocumentoId: 'cndt',
    status: 'aprovado',
    validade: '2026-09-28',
    arquivo: { nome: 'cndt-2026-04.pdf', tamanhoKb: 150, enviadoEm: '2026-04-01T10:30' },
    decisao: { por: CAMILA, em: '2026-04-02T11:05' },
    anteriores: [],
  },
  {
    id: 'doc-atestado-capacidade',
    tipoDocumentoId: 'atestado-capacidade',
    status: 'aprovado',
    arquivo: { nome: 'atestado-capacidade-tecnica.pdf', tamanhoKb: 940, enviadoEm: '2026-02-18T11:20' },
    decisao: { por: MARINA, em: '2026-02-20T15:32' },
    anteriores: [],
  },
  {
    id: 'doc-pgr',
    tipoDocumentoId: 'pgr',
    status: 'emAnalise',
    arquivo: { nome: 'pgr-2026-construtora-exemplo.pdf', tamanhoKb: 1843, enviadoEm: '2026-09-16T08:42' },
    anteriores: [],
  },
  { id: 'doc-pcmso', tipoDocumentoId: 'pcmso', status: 'pendente', exigidoDesde: '2026-09-02', anteriores: [] },
  {
    id: 'doc-apolice-rc',
    tipoDocumentoId: 'apolice-rc',
    status: 'emAnalise',
    arquivo: { nome: 'apolice-rc-2026.pdf', tamanhoKb: 1310, enviadoEm: '2026-09-15T17:10' },
    anteriores: [],
  },
  {
    id: 'doc-crea',
    tipoDocumentoId: 'crea',
    status: 'aprovado',
    validade: '2027-06-30',
    arquivo: { nome: 'certidao-crea-construtora-exemplo.pdf', tamanhoKb: 230, enviadoEm: '2026-01-20T09:20' },
    decisao: { por: MARINA, em: '2026-01-21T11:00' },
    anteriores: [],
  },
];

const REMESSA = 'rem-0911';
const ENVIO_REMESSA = '2026-09-11T09:03';

export const remessas: readonly Remessa[] = [
  {
    id: REMESSA,
    enviadaEm: ENVIO_REMESSA,
    funcionarioIds: ['jose-souza', 'marcos-lima', 'antonio-silva', 'rafael-barbosa', 'edson-santos', 'paulo-nogueira', 'cicero-costa', 'wellington-duarte'],
  },
];

type LinhaFuncionario = [id: string, nome: string, cpf: string, telefone: string, funcao: string, obraId: string];

const LINHAS: readonly LinhaFuncionario[] = [
  ['jose-souza', 'José Carlos de Souza', '12345678900', '81991230011', 'Mestre de obras', 'ob-2401'],
  ['marcos-lima', 'Marcos Vinícius Lima', '23456789011', '81992340122', 'Pedreiro', 'ob-2401'],
  ['antonio-silva', 'Antônio Pereira da Silva', '34567890122', '81996543456', 'Pedreiro', 'ob-2402'],
  ['rafael-barbosa', 'Rafael Gomes Barbosa', '45678901233', '81994560344', 'Servente', 'ob-2401'],
  ['edson-santos', 'Edson Araújo Santos', '56789012344', '81995670455', 'Carpinteiro', 'ob-2402'],
  ['paulo-nogueira', 'Paulo Henrique Nogueira', '67890123455', '81996780566', 'Armador', 'ob-2402'],
  ['cicero-costa', 'Cícero Bezerra da Costa', '78901234566', '81997890677', 'Pedreiro', 'ob-2402'],
  ['wellington-duarte', 'Wellington Duarte', '89012345677', '81991098901', 'Servente', 'ob-2401'],
];

export const funcionarios: readonly Funcionario[] = LINHAS.map(([id, nome, cpf, telefone, funcao, obraId]) => ({
  id,
  nome,
  cpf,
  telefone,
  funcao,
  obraId,
  alocadoDesde: ENVIO_REMESSA.slice(0, 10),
  remessaId: REMESSA,
}));

type St = ArquivoFuncionario['status'];
/** [tipo, status, validade, tamanho em KB, extensão] — o que faltar não foi enviado. */
type LinhaArquivo = [tipo: string, status: St, validade: string | undefined, kb: number, ext?: 'pdf' | 'jpg'];

const PREFIXO: Record<string, string> = { aso: 'aso', epi: 'ficha-epi', 'rg-cnh': 'rg', nr35: 'nr35' };
const DECISOR: Record<string, { por: string; em: string }> = {
  'jose-souza': { por: RODRIGO, em: '2026-09-13T11:02' },
  'marcos-lima': { por: RODRIGO, em: '2026-09-13T11:20' },
  'antonio-silva': { por: CAMILA, em: '2026-09-12T16:40' },
  'rafael-barbosa': { por: CAMILA, em: '2026-09-14T09:10' },
  'edson-santos': { por: CAMILA, em: '2026-09-12T16:10' },
  'paulo-nogueira': { por: CAMILA, em: '2026-09-14T09:30' },
  'cicero-costa': { por: CAMILA, em: '2026-09-12T15:30' },
  'wellington-duarte': { por: RODRIGO, em: '2026-09-13T14:26' },
};

const ARQUIVOS_POR_PESSOA: Record<string, readonly LinhaArquivo[]> = {
  'jose-souza': [['aso', 'aprovado', '2026-10-20', 1180], ['epi', 'aprovado', undefined, 760], ['rg-cnh', 'aprovado', undefined, 1950, 'jpg'], ['nr35', 'aprovado', '2028-03-15', 620]],
  'marcos-lima': [['aso', 'emAnalise', '2027-09-05', 1240], ['epi', 'emAnalise', undefined, 810], ['rg-cnh', 'aprovado', undefined, 2010, 'jpg'], ['nr35', 'aprovado', '2028-04-02', 590]],
  'antonio-silva': [['aso', 'aprovado', '2027-08-30', 1100], ['epi', 'aprovado', undefined, 790], ['rg-cnh', 'aprovado', undefined, 1890, 'jpg'], ['nr35', 'aprovado', '2028-02-10', 610]],
  'rafael-barbosa': [['aso', 'aprovado', '2027-09-10', 1150], ['rg-cnh', 'aprovado', undefined, 1920, 'jpg']],
  'edson-santos': [['aso', 'aprovado', '2027-08-18', 1090], ['epi', 'aprovado', undefined, 770], ['rg-cnh', 'aprovado', undefined, 1870, 'jpg'], ['nr35', 'aprovado', '2028-01-22', 600]],
  'paulo-nogueira': [['aso', 'emAnalise', '2027-09-12', 1210], ['epi', 'aprovado', undefined, 800], ['rg-cnh', 'aprovado', undefined, 1940, 'jpg'], ['nr35', 'emAnalise', '2028-05-04', 640]],
  'cicero-costa': [['aso', 'aprovado', '2027-07-28', 1130], ['epi', 'aprovado', undefined, 780], ['rg-cnh', 'aprovado', undefined, 1900, 'jpg'], ['nr35', 'aprovado', '2028-02-28', 615]],
  'wellington-duarte': [['aso', 'reprovado', undefined, 1200], ['epi', 'aprovado', undefined, 800], ['rg-cnh', 'aprovado', undefined, 2000, 'jpg'], ['nr35', 'aprovado', '2028-03-01', 600]],
};

function slugPessoa(nome: string): string {
  const partes = nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(' ')
    .filter((p) => p.length > 2);
  return [partes[0], partes[partes.length - 1]].filter(Boolean).join('-');
}

export const arquivos: readonly ArquivoFuncionario[] = funcionarios.flatMap((f) =>
  (ARQUIVOS_POR_PESSOA[f.id] ?? []).map(([tipo, status, validade, kb, ext = 'pdf']): ArquivoFuncionario => {
    const decisor = DECISOR[f.id] ?? { por: RODRIGO, em: '2026-09-13T11:00' };
    const reprovado = status === 'reprovado';
    return {
      id: `arq-${f.id}-${tipo}`,
      funcionarioId: f.id,
      tipoDocumentoId: tipo,
      status,
      validade,
      arquivo: { nome: `${PREFIXO[tipo] ?? tipo}-${slugPessoa(f.nome)}.${ext}`, tamanhoKb: kb, enviadoEm: ENVIO_REMESSA },
      decisao:
        status === 'emAnalise'
          ? undefined
          : reprovado
            ? {
                ...decisor,
                motivo: 'ilegivel',
                observacao: 'A foto do ASO está cortada e não dá para ler a data do exame. Reenvie o documento completo, em PDF.',
              }
            : decisor,
      anteriores: [],
    };
  }),
);

const voce = { kind: 'voce' } as const;
const jn = (nome: string) => ({ kind: 'jotanunes', nome }) as const;

/** Histórico dos últimos 12 meses: 11 envios, 9 decisões e 4 exigências. Mais recente primeiro. */
export const eventos: readonly EventoHistorico[] = [
  { id: 'ev-pgr', quando: '2026-09-16T08:42', acao: 'documentoEnviado', item: 'PGR – Programa de Gerenciamento de Riscos', por: voce },
  { id: 'ev-apolice', quando: '2026-09-15T17:10', acao: 'documentoEnviado', item: 'Apólice de Seguro de Responsabilidade Civil', por: voce },
  { id: 'ev-aso-wellington', quando: '2026-09-13T14:26', acao: 'documentoReprovado', item: 'ASO — Wellington Duarte', por: jn(RODRIGO) },
  { id: 'ev-remessa', quando: ENVIO_REMESSA, acao: 'remessaEnviada', item: 'Remessa com 8 funcionários', por: voce },
  { id: 'ev-seg-mirante', quando: '2026-09-02T11:47', acao: 'novaExigencia', item: 'Segurança do trabalho em obra · Residencial Mirante do Parque', por: jn(CAMILA) },
  { id: 'ev-reserva', quando: '2026-09-01T14:30', acao: 'obraVinculada', item: 'Reserva das Águas', por: jn(CAMILA) },
  { id: 'ev-cnd-aprovada', quando: '2026-08-25T16:20', acao: 'documentoAprovado', item: 'Certidão Negativa de Débitos Federais', por: jn(MARINA) },
  { id: 'ev-cnd-envio', quando: '2026-08-25T09:10', acao: 'documentoEnviado', item: 'Certidão Negativa de Débitos Federais', por: voce },
  { id: 'ev-cnd-v1-reprovada', quando: '2026-08-19T10:00', acao: 'documentoReprovado', item: 'Certidão Negativa de Débitos Federais', por: jn(MARINA) },
  { id: 'ev-cnd-v1-envio', quando: '2026-08-18T14:05', acao: 'documentoEnviado', item: 'Certidão Negativa de Débitos Federais', por: voce },
  { id: 'ev-cndt-aprovada', quando: '2026-04-02T11:05', acao: 'documentoAprovado', item: 'Certidão Negativa de Débitos Trabalhistas', por: jn(CAMILA) },
  { id: 'ev-cndt-envio', quando: '2026-04-01T10:30', acao: 'documentoEnviado', item: 'Certidão Negativa de Débitos Trabalhistas', por: voce },
  { id: 'ev-fgts-aprovada', quando: '2026-03-13T09:15', acao: 'documentoAprovado', item: 'Certidão de Regularidade do FGTS', por: jn(MARINA) },
  { id: 'ev-fgts-envio', quando: '2026-03-12T15:40', acao: 'documentoEnviado', item: 'Certidão de Regularidade do FGTS', por: voce },
  { id: 'ev-jardins', quando: '2026-03-02T10:15', acao: 'obraVinculada', item: 'Edifício Jardins da Torre', por: jn(CAMILA) },
  { id: 'ev-atestado-aprovado', quando: '2026-02-20T15:32', acao: 'documentoAprovado', item: 'Atestado de Capacidade Técnica', por: jn(MARINA) },
  { id: 'ev-atestado-envio', quando: '2026-02-18T11:20', acao: 'documentoEnviado', item: 'Atestado de Capacidade Técnica', por: voce },
  { id: 'ev-crea-aprovado', quando: '2026-01-21T11:00', acao: 'documentoAprovado', item: 'Certidão de Registro no CREA', por: jn(MARINA) },
  { id: 'ev-crea-envio', quando: '2026-01-20T09:20', acao: 'documentoEnviado', item: 'Certidão de Registro no CREA', por: voce },
  { id: 'ev-cartao-aprovado', quando: '2026-01-12T10:40', acao: 'documentoAprovado', item: 'Cartão CNPJ', por: jn(MARINA) },
  { id: 'ev-contrato-aprovado', quando: '2026-01-12T10:30', acao: 'documentoAprovado', item: 'Contrato Social consolidado', por: jn(MARINA) },
  { id: 'ev-cartao-envio', quando: '2026-01-10T10:12', acao: 'documentoEnviado', item: 'Cartão CNPJ', por: voce },
  { id: 'ev-contrato-envio', quando: '2026-01-10T10:05', acao: 'documentoEnviado', item: 'Contrato Social consolidado', por: voce },
  { id: 'ev-mirante', quando: '2026-01-10T08:05', acao: 'obraVinculada', item: 'Residencial Mirante do Parque', por: jn(CAMILA) },
];
