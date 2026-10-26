import type { Empresa } from '@/entities';
import { formatCnpj, formatDate } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Block, Field, InfoNote, Input, Select, Text } from '@/shared/ui';

const t = strings.pages.empresa.cadastro;

/** Dados do cadastro interno da JotaNunes: só leitura. */
export function CadastroEmpresa({ empresa }: { empresa: Empresa }) {
  return (
    <Block
      title={t.title}
      action={
        <Text size="support" tone="faint">
          {strings.dominio.fornecedorDe(empresa.tipos)}
        </Text>
      }
      padded
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t.razao} className="sm:col-span-2">
          {(control) => <Input {...control} readOnly value={empresa.razaoSocial} />}
        </Field>
        <Field label={t.cnpj}>{(control) => <Input {...control} readOnly value={formatCnpj(empresa.cnpj)} />}</Field>
        <Field label={t.ie}>{(control) => <Input {...control} readOnly value={empresa.inscricaoEstadual} />}</Field>
        <Field label={t.endereco} className="sm:col-span-2">
          {(control) => <Input {...control} readOnly value={empresa.endereco} />}
        </Field>
        <Field label={t.atividade}>
          {(control) => <Select {...control} disabled options={[{ value: empresa.atividade, label: empresa.atividade }]} value={empresa.atividade} />}
        </Field>
        <Field label={t.desde}>{(control) => <Input {...control} readOnly value={formatDate(empresa.fornecedorDesde)} />}</Field>
      </div>
      <InfoNote title={t.nota.title} className="mt-4">
        {t.nota.texto}
      </InfoNote>
    </Block>
  );
}
