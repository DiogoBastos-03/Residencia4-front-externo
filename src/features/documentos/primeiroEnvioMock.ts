import { createStore } from '@/shared/lib';
import { exigenciasSemEnvioAnterior } from './checklistMock';

type Recebimento = {
  workflowSubmissionId: string;
  documentSubmissionId: string;
  status: 'Recebido';
};

type SituacaoEnvio = {
  documentSubmissionId: string;
  status: 'Pending' | 'Approved';
  rejectionReason: string | null;
  iaScore: number | null;
};

type Envio = { recebimento: Recebimento; situacao: SituacaoEnvio | null };

export const primeirosEnviosStore = createStore<ReadonlyMap<string, Envio>>(new Map());

function aguardarResposta() {
  return new Promise<void>((resolve) => setTimeout(resolve, 400));
}

/** POST /api/v1/submissions */
export async function postarPrimeiroEnvio(dados: FormData, falhar = false): Promise<{ status: 201; body: Recebimento }> {
  const arquivo = dados.get('File');
  const definitionId = dados.get('DocumentDefinitionId');
  await aguardarResposta();

  const envios = primeirosEnviosStore.get();
  if (falhar || !(arquivo instanceof File) || typeof definitionId !== 'string'
    || !exigenciasSemEnvioAnterior.has(definitionId) || envios.has(definitionId)) {
    throw new Error('Não foi possível receber o arquivo.');
  }

  const body: Recebimento = {
    workflowSubmissionId: crypto.randomUUID(),
    documentSubmissionId: crypto.randomUUID(),
    status: 'Recebido',
  };
  primeirosEnviosStore.set((atuais) => new Map(atuais).set(definitionId, { recebimento: body, situacao: null }));
  return { status: 201, body };
}

/** GET /api/v1/submissions/{documentSubmissionId}/status */
export async function consultarSituacaoEnvio(documentSubmissionId: string, falhar = false): Promise<SituacaoEnvio> {
  await aguardarResposta();

  const envios = primeirosEnviosStore.get();
  const registro = [...envios].find(([, envio]) => envio.recebimento.documentSubmissionId === documentSubmissionId);
  if (falhar || !registro) throw new Error('Não foi possível consultar a situação.');

  const [definitionId, envio] = registro;
  const situacao: SituacaoEnvio = {
    documentSubmissionId,
    status: envio.situacao ? 'Approved' : 'Pending',
    rejectionReason: null,
    iaScore: null,
  };
  primeirosEnviosStore.set((atuais) => new Map(atuais).set(definitionId, { ...envio, situacao }));
  return situacao;
}
