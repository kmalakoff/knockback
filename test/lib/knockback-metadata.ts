function isMetadataRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getKnockbackMetadata(owner: object): Record<string, unknown> {
  if (!('__kb' in owner)) throw new TypeError('Expected Knockback metadata');
  const metadata = owner.__kb;
  if (!isMetadataRecord(metadata)) throw new TypeError('Knockback metadata must be an object');
  return metadata;
}
