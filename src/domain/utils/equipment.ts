export type CanonicalEquipment = 'none' | 'pull_up_bar' | 'vertical_support';

/**
 * Normalizes any equipment string variation into a canonical string.
 * Resolves the legacy 'pullup_bar' vs canonical 'pull_up_bar' inconsistency.
 */
export function normalizeEquipment(equipment?: string | null): string {
  if (!equipment) return 'none';
  const trimmed = equipment.trim().toLowerCase();
  if (trimmed === 'pullup_bar' || trimmed === 'pull_up_bar' || trimmed === 'pullupbar') {
    return 'pull_up_bar';
  }
  if (trimmed === 'none' || trimmed === 'no_equipment' || trimmed === 'bodyweight') {
    return 'none';
  }
  if (trimmed === 'vertical_support' || trimmed === 'verticalsupport' || trimmed === 'vertical_pole') {
    return 'vertical_support';
  }
  return trimmed;
}

/**
 * Checks if required equipment is satisfied by user's available equipment list.
 *
 * NO EQUIPMENT FIRST PHILOSOPHY:
 * 1. If required equipment is 'none' (or empty), it is ALWAYS available.
 * 2. If required equipment is 'pull_up_bar', it is only available if user has 'pull_up_bar'
 *    (or legacy 'pullup_bar').
 * 3. Pull-up bar is strictly optional and never required by default.
 * 4. Invalid or unknown equipment requirements return false.
 */
export function isEquipmentAvailable(
  userEquipment: string[] = ['none'],
  requiredEquipment: string = 'none'
): boolean {
  const normRequired = normalizeEquipment(requiredEquipment);
  if (normRequired === 'none') {
    return true;
  }
  if (!Array.isArray(userEquipment) || userEquipment.length === 0) {
    return false;
  }
  const normUserEquipment = userEquipment.map(normalizeEquipment);
  return normUserEquipment.includes(normRequired);
}
