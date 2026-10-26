import { useNavigate } from 'react-router';
import { paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Button, Modal } from '@/shared/ui';

const t = strings.layout.modalSair;

/** Confirmação de saída. Sair não é destrutivo: o botão é o primário grafite. */
export function ModalSair({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.title}
      description={t.texto}
      footer={
        <>
          <Button onClick={onClose}>{t.cancelar}</Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              navigate(paths.entrar);
            }}
          >
            {t.confirmar}
          </Button>
        </>
      }
    />
  );
}
