/**
 * Утилитарные функции для работы с данными пользователя
 */

/**
 * Возвращает отображаемое имя пользователя
 * Если имя пустое или undefined, возвращает "Гость"
 * 
 * @param name - Имя пользователя (может быть undefined или пустой строкой)
 * @returns Имя пользователя или "Гость" для пустых значений
 * 
 * Requirements: 5.1, 5.4
 */
export function getDisplayName(name?: string): string {
  const trimmedName = name?.trim();
  return trimmedName || 'Гость';
}
