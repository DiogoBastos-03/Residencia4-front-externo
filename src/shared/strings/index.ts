import { common } from './common';
import { dominio } from './dominio';
import { layout } from './layout';
import { statusLabels, tagLabels } from './status';
import { ui } from './ui';
import { acessoPage } from './pages/acesso';
import { componentesPage } from './pages/componentes';
import { documentosPage } from './pages/documentos';
import { empresaPage } from './pages/empresa';
import { envioPage } from './pages/envio';
import { estadosPage } from './pages/estados';
import { funcionariosPage } from './pages/funcionarios';
import { historicoPage } from './pages/historico';
import { inicioPage } from './pages/inicio';
import { naoEncontradaPage } from './pages/naoEncontrada';
import { obrasPage } from './pages/obras';
import { remessaPage } from './pages/remessa';

/**
 * Todo texto de interface do portal. Para trocar o vocabulário,
 * edite estes arquivos — nunca escreva texto direto no JSX.
 */
export const strings = {
  common,
  status: statusLabels,
  tags: tagLabels,
  ui,
  layout,
  dominio,
  pages: {
    componentes: componentesPage,
    naoEncontrada: naoEncontradaPage,
    acesso: acessoPage,
    inicio: inicioPage,
    documentos: documentosPage,
    envio: envioPage,
    obras: obrasPage,
    funcionarios: funcionariosPage,
    remessa: remessaPage,
    historico: historicoPage,
    empresa: empresaPage,
    estados: estadosPage,
  },
} as const;

export type { StatusKey, TagKey } from './status';
export type { ChaveEstado, ChaveGrupoEstado } from './pages/estados';
