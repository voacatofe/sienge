import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-singleton';

export async function GET() {
  try {
    // Verificar quais modelos estão disponíveis
    const availableModels = Object.keys(prisma).filter(
      key => !key.startsWith('$') && !key.startsWith('_')
    );

    // Testar cada modelo novo
    const tests = {
      centroCusto: false,
      planoFinanceiro: false,
      extratoApropriacao: false,
    };

    // Tentar acessar centroCusto
    try {
      const centroCustoModel = (prisma as any).centroCusto;
      if (centroCustoModel) {
        const count = await centroCustoModel.count();
        tests.centroCusto = true;
      }
    } catch (e) {
      // Model não existe
    }

    // Tentar acessar planoFinanceiro
    try {
      const planoFinanceiroModel = (prisma as any).planoFinanceiro;
      if (planoFinanceiroModel) {
        const count = await planoFinanceiroModel.count();
        tests.planoFinanceiro = true;
      }
    } catch (e) {
      // Model não existe
    }

    // Tentar acessar extratoApropriacao
    try {
      const extratoApropriacaoModel = (prisma as any).extratoApropriacao;
      if (extratoApropriacaoModel) {
        const count = await extratoApropriacaoModel.count();
        tests.extratoApropriacao = true;
      }
    } catch (e) {
      // Model não existe
    }

    return NextResponse.json({
      success: true,
      availableModels,
      newModelsAvailable: tests,
      message: 'Models verification completed',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
