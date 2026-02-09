export function generateTicketCode(): string {
  const prefix = "EVENTIFY";
 
  const timePart = Date.now().toString(36).toUpperCase();

  const randomPart = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  return `${prefix}-${timePart}-${randomPart}`;
}
