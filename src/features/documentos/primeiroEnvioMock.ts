import { createStore } from '@/shared/lib';
import { checklistMock, exigenciasSemEnvioAnterior } from './checklistMock';

type Recebimento = {
  workflowSubmissionId: string;
  documentSubmissionId: string;
  status: 'Recebido';
};

type RecebimentoRenovacao = {
  documentSubmissionVersionId: string;
  status: 'Recebido';
};

type SituacaoEnvio = {
  documentSubmissionId: string;
  status: 'Pending' | 'Approved';
  rejectionReason: string | null;
  iaScore: number | null;
};

type Envio = { documentSubmissionId: string; situacao: SituacaoEnvio | null };

export const enviosChecklistStore = createStore<ReadonlyMap<string, Envio>>(new Map());

function aguardarResposta() {
  return new Promise<void>((resolve) => setTimeout(resolve, 400));
}

function registrarRecebimento(definitionId: string, documentSubmissionId: string) {
  enviosChecklistStore.set((atuais) => new Map(atuais).set(definitionId, { documentSubmissionId, situacao: null }));
}

/** POST /api/v1/submissions */
export async function postarPrimeiroEnvio(dados: FormData, falhar = false): Promise<{ status: 201; body: Recebimento }> {
  const arquivo = dados.get('File');
  const definitionId = dados.get('DocumentDefinitionId');
  await aguardarResposta();

  const envios = enviosChecklistStore.get();
  if (falhar || !(arquivo instanceof File) || typeof definitionId !== 'string'
    || !exigenciasSemEnvioAnterior.has(definitionId) || envios.has(definitionId)) {
    throw new Error('Não foi possível receber o arquivo.');
  }

  const body: Recebimento = {
    workflowSubmissionId: crypto.randomUUID(),
    documentSubmissionId: crypto.randomUUID(),
    status: 'Recebido',
  };
  registrarRecebimento(definitionId, body.documentSubmissionId);
  return { status: 201, body };
}

/** POST /api/v1/submissions/{documentSubmissionId}/replace */
export async function renovarEnvio(
  documentSubmissionId: string,
  dados: FormData,
  falhar = false,
): Promise<{ status: 200; body: RecebimentoRenovacao }> {
  const arquivo = dados.get('File');
  await aguardarResposta();

  const item = checklistMock.find((exigencia) => exigencia.documentSubmissionId === documentSubmissionId);
  if (falhar || !(arquivo instanceof File) || [...dados.keys()].length !== 1
    || !item || item.status !== 'Vencido' || enviosChecklistStore.get().has(item.documentDefinitionId)) {
    throw new Error('Não foi possível receber a renovação.');
  }

  const body: RecebimentoRenovacao = { documentSubmissionVersionId: crypto.randomUUID(), status: 'Recebido' };
  registrarRecebimento(item.documentDefinitionId, documentSubmissionId);
  return { status: 200, body };
}

/** GET /api/v1/submissions/{documentSubmissionId}/status */
export async function consultarSituacaoEnvio(documentSubmissionId: string, falhar = false): Promise<SituacaoEnvio> {
  await aguardarResposta();

  const envios = enviosChecklistStore.get();
  const registro = [...envios].find(([, envio]) => envio.documentSubmissionId === documentSubmissionId);
  if (falhar || !registro) throw new Error('Não foi possível consultar a situação.');

  const [definitionId, envio] = registro;
  const situacao: SituacaoEnvio = {
    documentSubmissionId,
    status: envio.situacao ? 'Approved' : 'Pending',
    rejectionReason: null,
    iaScore: null,
  };
  enviosChecklistStore.set((atuais) => new Map(atuais).set(definitionId, { ...envio, situacao }));
  return situacao;
}
