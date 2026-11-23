import { useState } from 'react';
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { DocumentoDrawer, filtrarLinhas, PrimeiroEnvioDrawer, TabelaDocumentos, useDocumentos, useFiltrosDocumentos, type FiltroDocumentos, type ItemChecklist } from '@/features/documentos';
import { focarDepois, paths, useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AsyncContent, Button, EmptyState, FilterBar, PageHeader, SearchInput, Skeleton, SkeletonTable, Stack } from '@/shared/ui';

const t = strings.pages.documentos;

function lerExemplo(valor: string | null): 'valido' | 'invalido' | null {
  return valor === 'valido' || valor === 'invalido' ? valor : null;
}

export function DocumentosPage() {
  useDocumentTitle(t.title);
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const query = useDocumentos();
  const { filtro, busca, atualizar } = useFiltrosDocumentos();
  const [itemEnvio, setItemEnvio] = useState<ItemChecklist | null>(null);

  function fechar() {
    const p = new URLSearchParams(params);
    p.delete('acao');
    p.delete('exemplo');
    const qs = p.toString();
    navigate(`${paths.documentos}${qs ? `?${qs}` : ''}`);
    if (id) focarDepois(`a[href^="${paths.documento(id)}"]`);
  }

  function trocarModo(enviar: boolean) {
    setParams(
      (atual) => {
        const p = new URLSearchParams(atual);
        if (enviar) p.set('acao', 'enviar');
        else p.delete('acao');
        return p;
      },
      { replace: true },
    );
  }

  return (
    <Stack>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <AsyncContent
        query={query}
        skeleton={
          <Stack>
            <Skeleton className="h-8.5 w-96 max-w-full" />
            <SkeletonTable rows={6} columns={5} />
          </Stack>
        }
        isEmpty={(d) => d.itens.length === 0}
        empty={<EmptyState icon={DocumentTextIcon} title={t.vazioTitle} description={t.vazioDescription} />}
      >
        {(d) => {
          const itens = filtrarLinhas(d.itens, filtro, busca);
          const opcoes: Array<{ value: FiltroDocumentos; label: string; count: number }> = [
            { value: 'todos', label: t.filtros.todos, count: d.contagem.todos },
            { value: 'pendentes', label: t.filtros.pendentes, count: d.contagem.pendentes },
            { value: 'analise', label: t.filtros.analise, count: d.contagem.analise },
            { value: 'aprovados', label: t.filtros.aprovados, count: d.contagem.aprovados },
          ];
          return (
            <Stack gap="lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <FilterBar label={t.filtrosLabel} options={opcoes} value={filtro} onChange={(f) => atualizar({ filtro: f })} />
                <SearchInput
                  label={t.buscaLabel}
                  placeholder={t.buscaPlaceholder}
                  value={busca}
                  onChange={(e) => atualizar({ busca: e.target.value })}
                  wrapperClassName="md:w-65"
                />
              </div>
              {itens.length === 0 ? (
                <EmptyState
                  icon={MagnifyingGlassIcon}
                  title={t.semResultadoTitle}
                  description={t.semResultadoDescription}
                  action={<Button onClick={() => atualizar({ filtro: 'todos', busca: '' })}>{t.limparFiltros}</Button>}
                />
              ) : (
                <TabelaDocumentos itens={itens} onEnvio={setItemEnvio} />
              )}
            </Stack>
          );
        }}
      </AsyncContent>
      <DocumentoDrawer id={id} enviar={params.get('acao') === 'enviar'} exemplo={lerExemplo(params.get('exemplo'))} onClose={fechar} onModo={trocarModo} />
      {itemEnvio && (
        <PrimeiroEnvioDrawer item={itemEnvio} cenario={params.get('primeiroEnvio')} onClose={() => setItemEnvio(null)} />
      )}
    </Stack>
  );
}
