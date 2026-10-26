import { paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Badge, Block, BlockRow, ButtonLink, Text } from '@/shared/ui';
import type { FichaObra } from '../hooks/useObras';

const t = strings.pages.obras.detalhe.exige;

/** Cada lista de exigências da obra que vale para a empresa, com quanto está em dia. */
export function ExigenciasDaObra({ ficha }: { ficha: FichaObra }) {
  return (
    <Block title={t.title}>
      {ficha.listasNaObra.length === 0 ? (
        <Text size="support" tone="muted" className="px-4 py-6">
          {t.vazio}
        </Text>
      ) : (
        <ul>
          {ficha.listasNaObra.map((l) => (
            <BlockRow as="li" key={l.id} className="flex-wrap">
              <div className="min-w-0 flex-1 basis-60">
                <p className="flex flex-wrap items-center gap-2 text-body">
                  {l.nome}
                  <Badge status={l.tipo} />
                </p>
                <Text size="support" tone="muted" className="mt-0.5">
                  {t.itens(l.obrigatorios, l.opcionais, l.itensFuncionario)}
                </Text>
              </div>
              <Text size="support" tone="muted">
                {strings.dominio.emDia(l.emDia, l.obrigatorios)}
              </Text>
              <ButtonLink to={`${paths.documentos}#${l.id}`} size="sm" aria-label={t.verDocumentosDescricao(l.nome)}>
                {t.verDocumentos}
              </ButtonLink>
            </BlockRow>
          ))}
        </ul>
      )}
    </Block>
  );
}
