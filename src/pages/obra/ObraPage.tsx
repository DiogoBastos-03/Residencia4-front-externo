import { BuildingOffice2Icon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router';
import { FuncionariosTabela } from '@/features/funcionarios';
import { ExigenciasDaObra, useObra } from '@/features/obras';
import { formatDate, paths, useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';
import {
  AsyncContent,
  Badge,
  Block,
  ButtonLink,
  EmptyState,
  Metric,
  MetricStrip,
  PageHeader,
  Skeleton,
  SkeletonBlock,
  SkeletonMetricStrip,
  Stack,
} from '@/shared/ui';

const t = strings.pages.obras.detalhe;

export function ObraPage() {
  const { id = '' } = useParams();
  const query = useObra(id);
  useDocumentTitle(query.data?.obra.nome ?? strings.pages.obras.title);

  return (
    <AsyncContent
      query={query}
      skeleton={
        <Stack>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-96 max-w-full" />
          <SkeletonMetricStrip columns={3} />
          <SkeletonBlock rows={2} />
          <SkeletonBlock rows={4} />
        </Stack>
      }
      isEmpty={(ficha) => ficha === null}
      empty={
        <EmptyState
          icon={BuildingOffice2Icon}
          title={t.naoEncontradaTitle}
          description={t.naoEncontradaDescription}
          action={<ButtonLink to={paths.obras}>{t.naoEncontradaAction}</ButtonLink>}
        />
      }
    >
      {(ficha) =>
        ficha && (
          <Stack>
            <PageHeader
              level="subpage"
              back={{ to: paths.obras, label: t.voltar }}
              title={ficha.obra.nome}
              badges={<Badge status={ficha.obra.situacao} />}
              subtitle={t.subtitulo(
                ficha.obra.codigo,
                strings.dominio.cidadeUf(ficha.obra.cidade, ficha.obra.uf),
                ficha.obra.servicoContratado,
                strings.dominio.periodo(formatDate(ficha.obra.inicio, 'monthYear'), formatDate(ficha.obra.fim, 'monthYear')),
              )}
            />
            <MetricStrip columns={3}>
              <Metric tone="pending" label={t.metricas.exigidos} value={ficha.documentosExigidos} hint={t.metricas.exigidosHint(ficha.listasNaObra.length)} />
              <Metric
                tone="primary"
                label={t.metricas.pendencias}
                value={<span className={ficha.pendencias.length > 0 ? 'text-primary' : undefined}>{ficha.pendencias.length}</span>}
                hint={ficha.pendencias.length > 0 ? t.metricas.pendenciasLista(ficha.pendenciasCurtas.map((p) => ({ curto: p.curto, situacao: strings.status[p.situacao] }))) : t.metricas.pendenciasNenhuma}
              />
              <Metric
                tone="pending"
                label={t.metricas.alocados}
                value={ficha.funcionarios.length}
                hint={ficha.funcionarios.length > 0 ? t.metricas.alocadosResumo(ficha.contagemFuncionarios) : t.metricas.alocadosNenhum}
              />
            </MetricStrip>
            <ExigenciasDaObra ficha={ficha} />
            <Block
              title={t.funcionarios.title}
              action={
                <ButtonLink to={paths.novaRemessa(ficha.obra.id)} variant="primary" size="sm" icon={PlusIcon}>
                  {t.funcionarios.adicionar}
                </ButtonLink>
              }
              padded
            >
              {ficha.funcionarios.length === 0 ? (
                <EmptyState framed={false} icon={UserGroupIcon} title={t.funcionarios.vazioTitle} description={t.funcionarios.vazioDescription} className="py-8" />
              ) : (
                <FuncionariosTabela resumos={ficha.funcionarios} semObra caption={t.funcionarios.caption} />
              )}
            </Block>
          </Stack>
        )
      }
    </AsyncContent>
  );
}
