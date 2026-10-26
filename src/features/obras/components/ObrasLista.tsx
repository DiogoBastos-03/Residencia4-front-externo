import type { ResumoObra } from '@/entities';
import { formatDate, paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Badge, ButtonLink, Mono, Text } from '@/shared/ui';

const t = strings.pages.obras;

/** Obras da empresa: o que faz em cada uma, o período, as listas, as pessoas e o que está pendente. */
export function ObrasLista({ obras }: { obras: readonly ResumoObra[] }) {
  return (
    <ul aria-label={t.caption} className="divide-y divide-border rounded-control border border-border">
      {obras.map(({ obra, listas, pendencias, funcionarios }) => (
        <li key={obra.id} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-block font-semibold">{obra.nome}</span>
              <Badge status={obra.situacao} />
            </p>
            <Text tone="soft" className="mt-1">
              {t.linha(obra.servicoContratado, strings.dominio.periodo(formatDate(obra.inicio, 'monthYear'), formatDate(obra.fim, 'monthYear')))}
            </Text>
            <Text size="support" tone="muted" className="mt-2">
              <Mono>{obra.codigo}</Mono>
              {strings.dominio.separador}
              {strings.dominio.cidadeUf(obra.cidade, obra.uf)}
            </Text>
          </div>
          <div className="flex flex-col gap-2 border-border md:w-72 md:flex-none md:border-l md:pl-5">
            <Text size="support" tone="muted">
              {t.contagem(listas.length, funcionarios.length)}
            </Text>
            <Text size="support" className={pendencias.length > 0 ? 'text-warn' : 'text-ok'}>
              {pendencias.length > 0 ? strings.dominio.pendencias(pendencias.length) : t.semPendencia}
            </Text>
            <ButtonLink to={paths.obra(obra.id)} size="sm" className="self-start max-md:self-stretch" aria-label={t.abrirDescricao(obra.nome)}>
              {t.abrir}
            </ButtonLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
