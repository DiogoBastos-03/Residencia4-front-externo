import type { ResumoFuncionario } from '@/entities';
import { formatCpf, paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Badge, Mono, Table, type TableColumn } from '@/shared/ui';

const t = strings.pages.funcionarios;

type Props = {
  resumos: readonly ResumoFuncionario[];
  /** Na ficha da obra a coluna "Obra" é redundante. */
  semObra?: boolean;
  caption?: string;
};

/** A linha abre o painel da pessoa sobre a lista. */
export function FuncionariosTabela({ resumos, semObra = false, caption = t.caption }: Props) {
  const colunas: TableColumn<ResumoFuncionario>[] = [
    { key: 'nome', header: t.colunas.funcionario, tone: 'strong', mobile: 'title', cell: (r) => r.funcionario.nome },
    { key: 'cpf', header: t.colunas.cpf, nowrap: true, cell: (r) => <Mono>{formatCpf(r.funcionario.cpf)}</Mono> },
    { key: 'funcao', header: t.colunas.funcao, tone: 'soft', cell: (r) => r.funcionario.funcao },
    ...(semObra ? [] : [{ key: 'obra', header: t.colunas.obra, tone: 'soft' as const, cell: (r: ResumoFuncionario) => r.obra?.nome ?? strings.common.emptyValue }]),
    { key: 'docs', header: t.colunas.documentos, nowrap: true, tone: 'soft', cell: (r) => strings.dominio.deTotal(r.enviadosOk, r.total) },
    { key: 'situacao', header: t.colunas.situacao, mobile: 'badge', cell: (r) => <Badge status={r.situacao} /> },
  ];
  return (
    <Table
      caption={caption}
      columns={colunas}
      rows={resumos}
      rowKey={(r) => r.funcionario.id}
      action={{ label: () => t.abrir, describe: (r) => r.funcionario.nome, to: (r) => paths.funcionario(r.funcionario.id) }}
    />
  );
}
