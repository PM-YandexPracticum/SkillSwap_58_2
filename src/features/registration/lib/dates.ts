/** «15.02.2010» → «2010-02-15», как birth_date в users.json */
export function toIsoDate(value: string): string {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value
}
