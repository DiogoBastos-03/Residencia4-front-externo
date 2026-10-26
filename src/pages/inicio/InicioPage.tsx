import { BlocoAtencao, BlocoAtualizacoes, BlocoObras, BlocoVencimentos, useInicio } from '@/features/inicio';
import { formatDate, useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AsyncContent, Grid, Metric, MetricStrip, PageHeader, SkeletonBlock, SkeletonMetricStrip, Stack } from '@/shared/ui';

const t = strings.pages.inicio;

export function InicioPage() {
  useDocumentTitle(t.title);
  const query = useInicio();
  return (
    <Stack>
      <PageHeader title={t.title} subtitle={query.data ? t.subtitle(formatDate(query.data.hoje, 'long')) : undefined} />
      <AsyncContent
        query={query}
        skeleton={
          <Stack>
            <SkeletonMetricStrip />
            <Grid>
              <SkeletonBlock rows={3} />
              <SkeletonBlock rows={3} />
              <SkeletonBlock rows={4} />
              <SkeletonBlock rows={4} />
            </Grid>
          </Stack>
        }
      >
        {(d) => (
          <Stack>
            <MetricStrip>
              <Metric tone="ok" label={t.metricas.emDia} value={d.metricas.emDia} hint={t.metricas.emDiaHint(d.metricas.obrigatorios)} />
              <Metric tone="review" label={t.metricas.emAnalise} value={d.metricas.emAnalise} hint={t.metricas.emAnaliseHint} />
              <Metric tone="pending" label={t.metricas.pendentes} value={d.metricas.pendentes} hint={t.metricas.pendentesHint} />
              <Metric
                tone="primary"
                label={t.metricas.vencidos}
                value={<span className={d.metricas.vencidos > 0 ? 'text-primary' : undefined}>{d.metricas.vencidos}</span>}
                hint={t.metricas.vencidosHint}
              />
            </MetricStrip>
            <Grid>
              <BlocoAtencao atencao={d.atencao} />
              <BlocoObras obras={d.obras} />
              <BlocoVencimentos vencimentos={d.vencimentos} hoje={d.hoje} />
              <BlocoAtualizacoes eventos={d.eventos} />
            </Grid>
          </Stack>
        )}
      </AsyncContent>
    </Stack>
  );
}
