export class FMoviesUtilities {
  static mapLanguage(label: string) {
    if (label === 'Arabic') return 'ar-ME';
    if (label === 'French') return 'fr-FR';
    if (label === 'German') return 'de-DE';
    if (label === 'Italian') return 'it-IT';
    if (label === 'English') return 'en-US';
    if (label === 'Portuguese') return 'pt-BR';
    if (label === 'Russian') return 'ru-RU';
    if (label === 'Spanish') return 'es-ES';
    if (label === 'Turkish') return 'tr-TR';
    return;
  }
}
