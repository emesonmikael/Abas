import { useSyncExternalStore } from 'react';
import { NfcCardPayload } from '@/types/fuel';

export interface NfcScanResult {
  serialNumber?: string;
  payload?: NfcCardPayload;
  rawText?: string;
}

const emptySubscribe = () => () => {};

// Hook for components to safely consume Web NFC support without hydration errors
export function useIsWebNfcSupported(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => typeof window !== 'undefined' && 'NDEFReader' in window,
    () => false
  );
}

// Check if browser natively supports Web NFC API
export function isWebNfcSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'NDEFReader' in window;
}

// Start Web NFC scanner if supported
export async function startWebNfcScan(
  onSuccess: (result: NfcScanResult) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  if (!isWebNfcSupported()) {
    onError('Web NFC API não é suportado neste navegador/dispositivo. Utilize o leitor virtual de teste.');
    return;
  }

  try {
    const NDEFReaderClass = (window as any).NDEFReader;
    const ndef = new NDEFReaderClass();
    await ndef.scan({ signal });

    ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
      let rawText = '';
      let parsedPayload: NfcCardPayload | undefined = undefined;

      if (message && message.records) {
        for (const record of message.records) {
          if (record.recordType === 'text' || record.recordType === 'url' || record.recordType === 'mime') {
            const textDecoder = new TextDecoder(record.encoding || 'utf-8');
            rawText = textDecoder.decode(record.data);
            try {
              const json = JSON.parse(rawText);
              if (json && (json.type === 'FLEET_FUEL_CARD' || json.plate || json.nfcTagId)) {
                parsedPayload = json;
              }
            } catch {
              // Not JSON text, keep rawText
            }
          }
        }
      }

      onSuccess({
        serialNumber: serialNumber || 'NFC-DEVICE-' + Math.floor(Math.random() * 10000),
        payload: parsedPayload,
        rawText: rawText || serialNumber
      });
    });

    ndef.addEventListener('readingerror', () => {
      onError('Erro ao ler a tag NFC. Aproxima o cartão novamente.');
    });

  } catch (err: any) {
    if (err.name === 'AbortError') return; // Scanner stopped normally
    onError(err?.message || 'Falha ao iniciar o leitor NFC.');
  }
}

// Write payload to physical NFC Card/Tag
export async function writeNfcTag(payload: NfcCardPayload): Promise<{ success: boolean; message: string }> {
  if (!isWebNfcSupported()) {
    return {
      success: false,
      message: 'Web NFC não disponível neste dispositivo. É necessário Chrome para Android com suporte NFC.'
    };
  }

  try {
    const NDEFReaderClass = (window as any).NDEFReader;
    const ndef = new NDEFReaderClass();
    const jsonStr = JSON.stringify(payload);
    
    await ndef.write({
      records: [
        {
          recordType: 'mime',
          mediaType: 'application/json',
          data: new TextEncoder().encode(jsonStr)
        },
        {
          recordType: 'text',
          data: `Placa: ${payload.plate} | ID: ${payload.nfcTagId}`
        }
      ]
    });

    return {
      success: true,
      message: `Cartão NFC gravado com sucesso para a placa ${payload.plate}!`
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Erro ao tentar gravar no cartão NFC. Certifique-se de manter a tag encostada.'
    };
  }
}
