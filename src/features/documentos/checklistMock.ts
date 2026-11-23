import type { ItemChecklist } from './types';

const ALVARA_ID = '8a17d513-1d11-4027-9cb4-22cb7b285739';

/** Histórico auxiliar da simulação, fora da resposta do checklist. */
export const exigenciasSemEnvioAnterior: ReadonlySet<string> = new Set([ALVARA_ID]);

/** Resposta simulada de GET /api/v1/submissions/checklist. */
export const checklistMock: readonly ItemChecklist[] = [
  {
    documentDefinitionId: '0c84e509-3ba0-4d44-9cbb-dd502da067ab',
    documentDefinitionName: 'Certidão Negativa de Débitos Federais',
    required: true,
    status: 'Atendido',
    expiresAt: '2027-04-30T00:00:00Z',
  },
  {
    documentDefinitionId: '3a7faae6-eaba-440b-9ba7-d4999128cc8c',
    documentDefinitionName: 'Certidão Negativa de Débitos Trabalhistas',
    required: true,
    status: 'Vencido',
    expiresAt: '2026-09-30T00:00:00Z',
  },
  {
    documentDefinitionId: 'dd91bb02-c617-442b-a29d-70f61556d1c8',
    documentDefinitionName: 'Contrato Social',
    required: true,
    status: 'Em análise',
    expiresAt: null,
  },
  {
    documentDefinitionId: ALVARA_ID,
    documentDefinitionName: 'Alvará de Funcionamento',
    required: true,
    status: 'Pendente',
    expiresAt: null,
  },
  {
    documentDefinitionId: '59bbe451-69d8-4021-8f9f-64a1e616c465',
    documentDefinitionName: 'Comprovante de Inscrição Estadual',
    required: false,
    status: 'Atendido',
    expiresAt: null,
  },
  {
    documentDefinitionId: 'f28d6dbf-f5bb-4c76-a958-1a68020ceb87',
    documentDefinitionName: 'Comprovante de Inscrição Municipal',
    required: true,
    status: 'Pendente',
    expiresAt: null,
  },
];
