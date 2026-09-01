export function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function normalizeFieldPath(value: string) {
  return value
    .trim()
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^body\./i, '')
    .replace(/^request\./i, '')
}

type NormalizeFieldNameOptions<TField extends string> = {
  fieldNames: TField[]
  aliases?: Record<string, TField>
}

export function normalizeFieldName<TField extends string>(
  fieldName: string,
  { aliases = {}, fieldNames }: NormalizeFieldNameOptions<TField>,
) {
  const normalizedName = normalizeFieldPath(fieldName)
  const directField = fieldNames.find((field) => field === normalizedName)

  if (directField) {
    return directField
  }

  const lowerName = normalizedName.toLowerCase()
  const caseInsensitiveField = fieldNames.find((field) => field.toLowerCase() === lowerName)

  return caseInsensitiveField ?? aliases[lowerName] ?? null
}
