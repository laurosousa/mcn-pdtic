/**
 * Edição pública (padrão do site): sem a avaliação de referência do PDTIC UFRR 2023–2025.
 * A edição completa (com a avaliação UFRR) é montada com VITE_EDICAO=completa e publicada em /mcn-pdtic/ufrr/.
 */
export const EDICAO_PUBLICA = import.meta.env.VITE_EDICAO !== 'completa';
