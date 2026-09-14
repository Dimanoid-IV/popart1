export function getGenerationFollowUpVisibility(resultCount) {
  return {
    canChangePhoto: resultCount >= 2,
    showContact: resultCount >= 4,
  };
}
