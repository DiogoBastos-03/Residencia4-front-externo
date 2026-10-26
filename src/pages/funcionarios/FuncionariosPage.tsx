import { MagnifyingGlassIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
  filtrarFuncionarios,
  FuncionarioDrawer,
  FuncionariosTabela,
  RemessaDrawer,
  useFiltrosFuncionarios,
  useFuncionarios,
  type FiltroFuncionarios,
} from '@/features/funcionarios';
import { focarDepois, paths, useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AsyncContent, Button, ButtonLink, EmptyState, FilterBar, InfoNote, PageHeader, SearchInput, Select, Skeleton, SkeletonTable, Stack } from '@/shared/ui';

const t = strings.pages.funcionarios;

/** Pessoas cadastradas pela empresa. A pessoa e a remessa abrem em painéis sobre a lista. */
export function FuncionariosPage() {
  useDocumentTitle(t.title);
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const query = useFuncionarios();
  const { filtros, atualizar, limpar, ativo } = useFiltrosFuncionarios();

  /** Volta para a lista sem os parâmetros dos painéis, mantendo os filtros. */
  function semPainel(): string {
    const p = new URLSearchParams(params);
    for (const chave of ['reenviar', 'remessa', 'remessaObra', 'exemplo']) p.delete(chave);
    const qs = p.toString();
    return `${paths.funcionarios}${qs ? `?${qs}` : ''}`;
  }

  function fecharPessoa() {
    navigate(semPainel());
    if (id) focarDepois(`a[href^="${paths.funcionario(id)}"]`);
  }

  function fecharRemessa() {
    navigate(semPainel(), { replace: true });
    focarDepois('[data-abre-remessa]');
  }

  function reenviar(tipo: string | null) {
    setParams(
      (atual) => {
        const p = new URLSearchParams(atual);
        if (tipo) p.set('reenviar', tipo);
        else p.delete('reenviar');
        return p;
      },
      { replace: true },
    );
  }

  const adicionar = (
    <ButtonLink to={paths.novaRemessa()} variant="primary" icon={PlusIcon} data-abre-remessa="">
      {t.adicionar}
    </ButtonLink>
  );

  return (
    <Stack>
      <PageHeader title={t.title} subtitle={t.subtitle} actions={adicionar} />
      <AsyncContent
        query={query}
        skeleton={
          <Stack>
            <Skeleton className="h-8.5 w-96 max-w-full" />
            <SkeletonTable rows={8} columns={6} />
          </Stack>
        }
        isEmpty={(d) => d.resumos.length === 0}
        empty={
          <EmptyState
            icon={UserGroupIcon}
            title={t.vazioTitle}
            description={query.data?.listaComFuncionarios ? t.vazioDescription(query.data.listaComFuncionarios) : t.vazioDescriptionGenerica}
            action={
              <ButtonLink to={paths.novaRemessa()} variant="primary" icon={PlusIcon}>
                {t.adicionar}
              </ButtonLink>
            }
          />
        }
      >
        {(d) => {
          const linhas = filtrarFuncionarios(d.resumos, filtros);
          const opcoes: Array<{ value: FiltroFuncionarios; label: string; count: number }> = [
            { value: 'todos', label: t.filtros.todos, count: d.contagem.total },
            { value: 'emDia', label: t.filtros.emDia, count: d.contagem.emDia },
            { value: 'emAnalise', label: t.filtros.emAnalise, count: d.contagem.emAnalise },
            { value: 'pendente', label: t.filtros.pendente, count: d.contagem.pendente },
            { value: 'reprovado', label: t.filtros.reprovado, count: d.contagem.reprovado },
          ];
          return (
            <Stack gap="lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <FilterBar label={t.filtrosLabel} options={opcoes} value={filtros.situacao} onChange={(situacao) => atualizar({ situacao })} />
                <div className="flex w-full flex-wrap gap-2 md:w-auto">
                  <Select
                    aria-label={t.obraLabel}
                    options={[{ value: '', label: t.todasObras }, ...d.obras.map((o) => ({ value: o.id, label: o.nome }))]}
                    value={filtros.obra}
                    onChange={(e) => atualizar({ obra: e.target.value })}
                    wrapperClassName="w-60 max-md:w-full"
                  />
                  <SearchInput
                    label={t.buscaLabel}
                    placeholder={t.buscaPlaceholder}
                    value={filtros.busca}
                    onChange={(e) => atualizar({ busca: e.target.value })}
                    wrapperClassName="md:w-65"
                  />
                </div>
              </div>
              {linhas.length === 0 ? (
                <EmptyState
                  icon={MagnifyingGlassIcon}
                  title={t.semResultadoTitle}
                  description={t.semResultadoDescription}
                  action={ativo && <Button onClick={limpar}>{t.limparFiltros}</Button>}
                />
              ) : (
                <FuncionariosTabela resumos={linhas} />
              )}
              <InfoNote title={t.nota.title}>{t.nota.texto}</InfoNote>
            </Stack>
          );
        }}
      </AsyncContent>
      <FuncionarioDrawer id={id} reenviar={params.get('reenviar')} onClose={fecharPessoa} onReenviar={reenviar} />
      <RemessaDrawer
        open={!id && params.get('remessa') === 'nova'}
        obraInicial={params.get('remessaObra')}
        exemplo={params.get('exemplo') === '1'}
        onClose={fecharRemessa}
      />
    </Stack>
  );
}
