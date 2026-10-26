import { ArrowUpTrayIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { acaoPara, diasEntre, type ItemAtencao } from '@/entities';
import { formatDate, paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Badge, Block, BlockRow, BlockRowLink, ButtonLink, Icon, Mono, Text } from '@/shared/ui';
import type { Inicio } from '../hooks/useInicio';

const t = strings.pages.inicio;

function linkVer(to: string, label: string) {
  return (
    <ButtonLink to={to} variant="tertiary" size="sm">
      {label}
      <Icon icon={ChevronRightIcon} size={16} />
    </ButtonLink>
  );
}

function textoAtencao(item: ItemAtencao): { titulo: string; detalhe: string; para: string; acao: 'enviar' | 'renovar' | 'reenviar' | 'ver' } {
  if (item.kind === 'documento') {
    const { linha } = item;
    const acao = acaoPara(linha.situacao);
    const detalhe =
      linha.situacao === 'vencido' && linha.doc?.validade
        ? t.atencao.venceu(formatDate(linha.doc.validade))
        : linha.situacao === 'reprovado' && linha.doc?.decisao?.motivo
          ? t.atencao.reprovado(strings.dominio.motivoCurto[linha.doc.decisao.motivo])
          : t.atencao.naoEnviado(formatDate(linha.doc?.exigidoDesde ?? linha.doc?.arquivo?.enviadoEm ?? ''));
    return { titulo: linha.nome, detalhe, para: paths.documento(linha.tipoDocumentoId, true), acao };
  }
  const motivo = item.arquivo.decisao?.motivo;
  return {
    titulo: item.titulo,
    detalhe: motivo ? t.atencao.reprovado(strings.dominio.motivoCurto[motivo]) : t.atencao.venceu(formatDate(item.arquivo.validade ?? '')),
    para: paths.documento(item.arquivo.id, true),
    acao: acaoPara(item.situacao),
  };
}

export function BlocoAtencao({ atencao }: { atencao: Inicio['atencao'] }) {
  return (
    <Block title={t.atencao.title} action={<Text size="support" tone="faint">{t.atencao.contagem(atencao.length)}</Text>}>
      {atencao.length === 0 ? (
        <div className="px-4 py-6">
          <Text weight="semibold">{t.atencao.vazioTitle}</Text>
          <Text size="support" tone="muted" className="mt-1">
            {t.atencao.vazioDescription}
          </Text>
        </div>
      ) : (
        <ul>
          {atencao.map((item) => {
            const { titulo, detalhe, para, acao } = textoAtencao(item);
            const situacao = item.kind === 'documento' ? item.linha.situacao : item.situacao;
            return (
              <BlockRow as="li" key={item.kind === 'documento' ? item.linha.tipoDocumentoId : item.arquivo.id} className="flex-wrap">
                <div className="min-w-0 flex-1 basis-56">
                  <p className="text-body">{titulo}</p>
                  <Text size="support" tone="muted" className="mt-0.5">
                    {detalhe}
                  </Text>
                </div>
                <Badge status={situacao} />
                <ButtonLink to={para} size="sm" icon={ArrowUpTrayIcon} aria-label={`${strings.dominio.acoes[acao]} — ${titulo}`}>
                  {strings.dominio.acoes[acao]}
                </ButtonLink>
              </BlockRow>
            );
          })}
        </ul>
      )}
    </Block>
  );
}

export function BlocoObras({ obras }: { obras: Inicio['obras'] }) {
  return (
    <Block title={t.obras.title} action={linkVer(paths.obras, t.obras.verTodas)}>
      {obras.length === 0 ? (
        <Text size="support" tone="muted" className="px-4 py-6">
          {t.obras.vazio}
        </Text>
      ) : (
        <ul className="divide-y divide-border">
          {obras.map(({ obra, pendencias, funcionarios }) => (
            <li key={obra.id}>
              <BlockRowLink to={paths.obra(obra.id)}>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-body">
                    {obra.nome}
                    <Badge status={obra.situacao} />
                  </p>
                  <Text size="support" tone="muted" className="mt-0.5">
                    {t.obras.linha(obra.servicoContratado, funcionarios.length)}
                  </Text>
                </div>
                <Text size="support" className={pendencias.length > 0 ? 'flex-none text-warn' : 'flex-none text-ok'}>
                  {pendencias.length > 0 ? strings.dominio.pendencias(pendencias.length) : t.obras.semPendencia}
                </Text>
              </BlockRowLink>
            </li>
          ))}
        </ul>
      )}
    </Block>
  );
}

export function BlocoVencimentos({ vencimentos, hoje }: { vencimentos: Inicio['vencimentos']; hoje: string }) {
  return (
    <Block title={t.vencimentos.title}>
      {vencimentos.length === 0 ? (
        <Text size="support" tone="muted" className="px-4 py-6">
          {t.vencimentos.vazio}
        </Text>
      ) : (
        <ul className="divide-y divide-border">
          {vencimentos.map((v) => {
            const dias = diasEntre(hoje, v.validade);
            const perto = dias <= 30;
            return (
              <li key={v.id}>
                <BlockRowLink to={paths.documento(v.para.id)}>
                  <span
                    className={
                      perto
                        ? 'flex w-10 flex-none flex-col items-center rounded-control bg-warn-bg py-1 text-warn'
                        : 'flex w-10 flex-none flex-col items-center rounded-control border border-border py-1 text-ink-2'
                    }
                  >
                    <span className="tabular text-body font-semibold">{formatDate(v.validade, 'day')}</span>
                    <span className="text-tag">{formatDate(v.validade, 'monthShort')}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body">{v.titulo}</p>
                    <Text size="support" tone="muted" className="mt-0.5">
                      {dias <= 60 ? t.vencimentos.emDias(dias) : t.vencimentos.emMes(formatDate(v.validade, 'monthYearLong'))}
                    </Text>
                  </div>
                </BlockRowLink>
              </li>
            );
          })}
        </ul>
      )}
    </Block>
  );
}

export function BlocoAtualizacoes({ eventos }: { eventos: Inicio['eventos'] }) {
  return (
    <Block title={t.atualizacoes.title} action={linkVer(paths.historico, t.atualizacoes.verHistorico)}>
      {eventos.length === 0 ? (
        <Text size="support" tone="muted" className="px-4 py-6">
          {t.atualizacoes.vazio}
        </Text>
      ) : (
        <ul>
          {eventos.map((e) => (
            <BlockRow as="li" key={e.id} className="items-start">
              <Mono className="w-22 flex-none pt-0.5 text-label text-ink-4">{formatDate(e.quando)}</Mono>
              <div className="min-w-0 flex-1">
                <p className="text-body">{e.item}</p>
                <Text size="support" tone="muted" className="mt-0.5">
                  {strings.pages.historico.acoes[e.acao]}
                  {strings.dominio.separador}
                  {e.por.kind === 'voce' ? strings.common.voce : strings.dominio.daJotaNunes(e.por.nome)}
                </Text>
              </div>
            </BlockRow>
          ))}
        </ul>
      )}
    </Block>
  );
}
