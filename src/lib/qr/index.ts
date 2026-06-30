/**
 * Calculates the CRC16-CCITT for a given string using 0xFFFF as initial value
 * and 0x1021 as polynomial.
 */
export function calculateCRC16(data: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }

  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Generates a dynamic QRIS string by embedding the total amount into a static QRIS string.
 * @param baseQris The base static QRIS string
 * @param amount The total transaction amount
 * @returns The dynamic QRIS string
 */
export function generateDynamicQris(baseQris: string, amount: number): string {
  if (!baseQris) return "";

  // EMV QR code standard typically ends with Tag 63 (CRC), Length 04, and then 4 bytes of CRC.
  // We remove the old CRC value but keep "6304" (which means Tag 63, Length 04)
  // Standard format check: does it end with 6304XXXX?
  let qrisPayload = baseQris;
  const lastIndex6304 = baseQris.lastIndexOf("6304");

  if (lastIndex6304 !== -1 && lastIndex6304 === baseQris.length - 8) {
    // Strip the old 4-character CRC
    qrisPayload = baseQris.substring(0, baseQris.length - 4);
  } else {
    // If it doesn't end with 6304XXXX, this might be malformed, but we will assume we append it.
    // Strip any existing 63 tag if it exists at the very end
    if (qrisPayload.endsWith("6304")) {
      qrisPayload = qrisPayload.substring(0, qrisPayload.length - 4); // We will append it back
    } else {
      qrisPayload = qrisPayload.replace(/6304[A-F0-9]{4}$/i, "");
    }
    qrisPayload += "6304";
  }

  // Ensure Point of Initiation Method is dynamic (Tag 01, Value 12)
  if (qrisPayload.includes("010211")) {
    qrisPayload = qrisPayload.replace("010211", "010212");
  }

  // Inject Amount (Tag 54)
  // Format: 54 + length(2 chars) + amount
  const amountStr = amount.toString();
  const amountLength = amountStr.length.toString().padStart(2, "0");
  const amountPayload = `54${amountLength}${amountStr}`;

  // Insert amount payload right before the "6304" tag
  const beforeCrc = qrisPayload.substring(0, qrisPayload.length - 4);
  const newPayload = `${beforeCrc}${amountPayload}6304`;

  // Calculate new CRC
  const newCrc = calculateCRC16(newPayload);

  return `${newPayload}${newCrc}`;
}
