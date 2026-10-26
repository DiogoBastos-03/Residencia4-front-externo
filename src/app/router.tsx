import { createBrowserRouter } from 'react-router';
import { ComponentesPage } from '@/pages/componentes/ComponentesPage';
import { DocumentosPage } from '@/pages/documentos/DocumentosPage';
import { EmpresaPage } from '@/pages/empresa/EmpresaPage';
import { EntrarPage } from '@/pages/entrar/EntrarPage';
import { EsqueciSenhaPage } from '@/pages/esqueci-senha/EsqueciSenhaPage';
import { EstadosPage } from '@/pages/estados/EstadosPage';
import { FuncionariosPage } from '@/pages/funcionarios/FuncionariosPage';
import { HistoricoPage } from '@/pages/historico/HistoricoPage';
import { InicioPage } from '@/pages/inicio/InicioPage';
import { NaoEncontradaPage } from '@/pages/nao-encontrada/NaoEncontradaPage';
import { ObraPage } from '@/pages/obra/ObraPage';
import { ObrasPage } from '@/pages/obras/ObrasPage';
import { paths } from '@/shared/lib';
import { AppLayout } from './layout/AppLayout';

export const router = createBrowserRouter([
  { path: paths.entrar, element: <EntrarPage /> },
  { path: paths.esqueciSenha, element: <EsqueciSenhaPage /> },
  // Vitrine do design system — disponível também no build durante a fase de revisão.
  { path: paths.componentes, element: <ComponentesPage /> },
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <InicioPage /> },
      // O documento e a pessoa abrem em painel lateral sobre a própria lista.
      { path: 'documentos/:id?', element: <DocumentosPage /> },
      { path: 'obras', element: <ObrasPage /> },
      { path: 'obras/:id', element: <ObraPage /> },
      { path: 'funcionarios/:id?', element: <FuncionariosPage /> },
      { path: 'historico', element: <HistoricoPage /> },
      { path: 'dados-da-empresa', element: <EmpresaPage /> },
      // Ferramenta de revisão — disponível também no build durante a fase de revisão.
      { path: '_estados', element: <EstadosPage /> },
      { path: '*', element: <NaoEncontradaPage /> },
    ],
  },
]);
