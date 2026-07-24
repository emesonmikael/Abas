import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave GEMINI_API_KEY não configurada no ambiente.' },
        { status: 500 }
      );
    }

    const { transactions, vehicles } = await req.json();

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Você é um especialista em auditoria de frotas e controle de consumo de combustível.
Analise os seguintes dados recentes de abastecimento por cartão NFC e veículos de frota:

VEÍCULOS CADASTRADOS:
${JSON.stringify(vehicles, null, 2)}

ÚLTIMOS ABASTECIMENTOS:
${JSON.stringify(transactions, null, 2)}

Gere um relatório executivo sucinto e direto em português do Brasil contendo:
1. **Resumo do Consumo**: Eficiência média da frota e principais gastos.
2. **Anomalias & Suspeitas de Irregularidade**: Destaque se houve incoerências de hodômetro, abastecimento acima da capacidade do tanque, consumo KM/L muito fora do normal.
3. **Recomendações Práticas**: 3 ações diretas para reduzir custos de combustível e evitar fraudes com cartões NFC.

Responda em formato Markdown bem formatado com emojis e títulos claros.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({
      analysis: response.text || 'Não foi possível gerar a análise da frota no momento.',
    });
  } catch (error: any) {
    console.error('Error calling Gemini API for fuel analysis:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao processar análise inteligente da frota.' },
      { status: 500 }
    );
  }
}
