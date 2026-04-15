import { intervalToDuration, parseISO } from 'date-fns';

export function calculateAge(birthDate: string, targetDate: string | Date = new Date()) {
  if (!birthDate) return '';
  const bDate = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  const tDate = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;

  try {
    const duration = intervalToDuration({ start: bDate, end: tDate });
    
    const years = duration.years || 0;
    const months = duration.months || 0;
    const days = duration.days || 0;

    const parts = [];
    if (years > 0) {
      parts.push(`${years} г.`);
      if (months > 0) {
        parts.push(`${months} мес.`);
      }
    } else if (months > 0) {
      parts.push(`${months} мес.`);
      if (days > 0) {
        parts.push(`${days} дн.`);
      }
    } else {
      parts.push(`${days} дн.`);
    }
    
    return parts.join(' ') || '0 дн.';
  } catch (e) {
    return '';
  }
}
