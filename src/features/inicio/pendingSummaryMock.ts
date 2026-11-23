export type PendingSummary = {
  pendingCount: number;
  upcomingExpirationCount: number;
  nextExpiringDocumentNames: readonly string[];
};

/** Resposta simulada de GET /api/v1/submissions/pending-summary. */
export const pendingSummaryMock: PendingSummary = {
  pendingCount: 3,
  upcomingExpirationCount: 2,
  nextExpiringDocumentNames: ['Certidão Negativa de Débitos', 'Alvará de Funcionamento'],
};

export const pendingSummaryVazio: PendingSummary = {
  pendingCount: 0,
  upcomingExpirationCount: 0,
  nextExpiringDocumentNames: [],
};
