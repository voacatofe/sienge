import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Buscar o log de sincronização mais recente
    const latestSync = await prisma.syncLog.findFirst({
      where: {
        entityType: 'batch_sync',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestSync) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nenhuma sincronização encontrada',
        },
        { status: 404 }
      );
    }

    // Calcular estatísticas
    const isRunning = latestSync.status === 'in_progress';
    const progress =
      latestSync.recordsProcessed > 0
        ? Math.round(
            (latestSync.recordsProcessed /
              (latestSync.recordsProcessed + latestSync.recordsErrors)) *
              100
          )
        : 0;

    return NextResponse.json({
      success: true,
      sync: {
        id: latestSync.id,
        status: latestSync.status,
        isRunning,
        progress,
        recordsProcessed: latestSync.recordsProcessed,
        recordsInserted: latestSync.recordsInserted,
        recordsUpdated: latestSync.recordsUpdated,
        recordsErrors: latestSync.recordsErrors,
        apiCallsMade: latestSync.apiCallsMade,
        startedAt: latestSync.createdAt,
        completedAt: latestSync.syncCompletedAt,
        duration: latestSync.syncCompletedAt
          ? Math.round(
              (latestSync.syncCompletedAt.getTime() -
                latestSync.createdAt.getTime()) /
                1000 /
                60
            )
          : Math.round(
              (Date.now() - latestSync.createdAt.getTime()) / 1000 / 60
            ),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar status da sincronização:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao buscar status da sincronização',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

// Endpoint para cancelar sincronização em andamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'cancel') {
      // Marcar sincronização atual como cancelada
      const latestSync = await prisma.syncLog.findFirst({
        where: {
          entityType: 'batch_sync',
          status: 'in_progress',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (latestSync) {
        await prisma.syncLog.update({
          where: { id: latestSync.id },
          data: {
            status: 'cancelled',
            syncCompletedAt: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Sincronização cancelada com sucesso',
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'Nenhuma sincronização em andamento encontrada',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Ação não reconhecida',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erro ao cancelar sincronização:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao cancelar sincronização',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
