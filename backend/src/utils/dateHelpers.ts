export const isValidEventDate = (date: Date | string): boolean => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return false;
  }
  const currentDate = new Date();
  return parsedDate.getTime() > currentDate.getTime();
};
export const formatDateTime = (date: Date | string, locale = 'en-US'): string => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date cannot be formatted.');
  }
  return parsedDate.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};