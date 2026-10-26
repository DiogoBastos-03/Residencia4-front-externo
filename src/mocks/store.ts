import type { Dataset } from '@/entities';
import { createStore } from '@/shared/lib';
import { AGORA, arquivos, documentos, empresa, eventos, funcionarios, HOJE, listas, obras, remessas, tiposDocumento } from './dados';

const dataset: Dataset = {
  hoje: HOJE,
  agora: AGORA,
  empresa,
  obras,
  listas,
  tiposDocumento,
  documentos,
  funcionarios,
  arquivos,
  remessas,
  eventos,
};

/** Dados vivos da sessão: envios, remessas e edições alteram esta store. Somem no F5, de propósito. */
export const datasetStore = createStore<Dataset>(dataset);
