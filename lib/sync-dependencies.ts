/**
 * Configuração de dependências entre entidades para sincronização
 * Define a ordem correta de sincronização para respeitar as constraints de foreign key
 */

export interface EntityDependency {
  entity: string;
  dependsOn: string[];
  phase: number;
}

// Fases de sincronização - entidades são sincronizadas em ordem de fase
export const SYNC_PHASES = {
  // Fase 1: Entidades independentes (sem foreign keys)
  INDEPENDENT: 1,

  // Fase 2: Entidades com dependências básicas
  BASIC_DEPENDENCIES: 2,

  // Fase 3: Entidades com múltiplas dependências
  COMPLEX_DEPENDENCIES: 3,

  // Fase 4: Entidades de relacionamento (muitos-para-muitos)
  RELATIONSHIPS: 4,
};

// Configuração de dependências entre entidades
export const ENTITY_DEPENDENCIES: EntityDependency[] = [
  // Fase 1: Entidades independentes
  {
    entity: 'companies',
    dependsOn: [],
    phase: SYNC_PHASES.INDEPENDENT,
  },
  {
    entity: 'customers',
    dependsOn: [],
    phase: SYNC_PHASES.INDEPENDENT,
  },
  {
    entity: 'indexers',
    dependsOn: [],
    phase: SYNC_PHASES.INDEPENDENT,
  },
  {
    entity: 'financial-plans',
    dependsOn: [],
    phase: SYNC_PHASES.INDEPENDENT,
  },
  {
    entity: 'receivable-carriers',
    dependsOn: [],
    phase: SYNC_PHASES.INDEPENDENT,
  },
  {
    entity: 'cost-centers',
    dependsOn: [],
    phase: SYNC_PHASES.INDEPENDENT,
  },

  // Fase 2: Entidades com dependências básicas
  {
    entity: 'enterprises',
    dependsOn: ['companies'],
    phase: SYNC_PHASES.BASIC_DEPENDENCIES,
  },
  {
    entity: 'projects',
    dependsOn: ['companies'],
    phase: SYNC_PHASES.BASIC_DEPENDENCIES,
  },

  // Fase 3: Entidades com múltiplas dependências
  {
    entity: 'sales-contracts',
    dependsOn: ['enterprises', 'companies', 'customers'],
    phase: SYNC_PHASES.COMPLEX_DEPENDENCIES,
  },
  {
    entity: 'units',
    dependsOn: ['enterprises', 'sales-contracts'],
    phase: SYNC_PHASES.COMPLEX_DEPENDENCIES,
  },
  {
    entity: 'income',
    dependsOn: ['customers', 'companies', 'sales-contracts'],
    phase: SYNC_PHASES.COMPLEX_DEPENDENCIES,
  },
  {
    entity: 'accounts-receivable',
    dependsOn: ['customers', 'companies', 'sales-contracts'],
    phase: SYNC_PHASES.COMPLEX_DEPENDENCIES,
  },
  {
    entity: 'accounts-payable',
    dependsOn: ['companies'],
    phase: SYNC_PHASES.COMPLEX_DEPENDENCIES,
  },

  // Fase 4: Entidades de relacionamento
  {
    entity: 'sales-commissions',
    dependsOn: ['sales-contracts'],
    phase: SYNC_PHASES.RELATIONSHIPS,
  },
];

/**
 * Obtém a ordem de sincronização respeitando as dependências
 * @param requestedEntities Lista de entidades solicitadas para sincronização
 * @returns Lista ordenada de entidades para sincronização
 */
export function getSyncOrder(requestedEntities: string[]): string[] {
  // Filtrar apenas as entidades solicitadas
  const requestedDependencies = ENTITY_DEPENDENCIES.filter(dep =>
    requestedEntities.includes(dep.entity)
  );

  // Adicionar automaticamente as dependências necessárias
  const requiredEntities = new Set<string>();

  function addWithDependencies(entity: string) {
    if (requiredEntities.has(entity)) return;

    const entityDep = ENTITY_DEPENDENCIES.find(dep => dep.entity === entity);
    if (!entityDep) {
      // Se não está na lista de dependências, adicionar diretamente
      requiredEntities.add(entity);
      return;
    }

    // Adicionar dependências primeiro
    for (const dep of entityDep.dependsOn) {
      addWithDependencies(dep);
    }

    // Depois adicionar a própria entidade
    requiredEntities.add(entity);
  }

  // Adicionar todas as entidades solicitadas com suas dependências
  for (const entity of requestedEntities) {
    addWithDependencies(entity);
  }

  // Ordenar por fase e retornar
  const orderedDependencies = ENTITY_DEPENDENCIES
    .filter(dep => requiredEntities.has(dep.entity))
    .sort((a, b) => a.phase - b.phase);

  return orderedDependencies.map(dep => dep.entity);
}

/**
 * Verifica se uma entidade tem todas suas dependências satisfeitas
 * @param entity Entidade a verificar
 * @param syncedEntities Lista de entidades já sincronizadas
 * @returns true se todas as dependências foram satisfeitas
 */
export function areDependenciesSatisfied(
  entity: string,
  syncedEntities: string[]
): boolean {
  const entityDep = ENTITY_DEPENDENCIES.find(dep => dep.entity === entity);
  if (!entityDep) return true; // Sem dependências definidas

  return entityDep.dependsOn.every(dep => syncedEntities.includes(dep));
}

/**
 * Obtém as entidades por fase de sincronização
 * @returns Mapa de fase para lista de entidades
 */
export function getEntitiesByPhase(): Map<number, string[]> {
  const phaseMap = new Map<number, string[]>();

  for (const dep of ENTITY_DEPENDENCIES) {
    if (!phaseMap.has(dep.phase)) {
      phaseMap.set(dep.phase, []);
    }
    phaseMap.get(dep.phase)!.push(dep.entity);
  }

  return phaseMap;
}

/**
 * Obtém as dependências diretas de uma entidade
 * @param entity Nome da entidade
 * @returns Lista de dependências diretas
 */
export function getDirectDependencies(entity: string): string[] {
  const entityDep = ENTITY_DEPENDENCIES.find(dep => dep.entity === entity);
  return entityDep ? entityDep.dependsOn : [];
}

/**
 * Valida se há dependências circulares na configuração
 * @returns true se não há dependências circulares
 */
export function validateNoCycles(): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(entity: string): boolean {
    visited.add(entity);
    recursionStack.add(entity);

    const dependencies = getDirectDependencies(entity);
    for (const dep of dependencies) {
      if (!visited.has(dep)) {
        if (hasCycle(dep)) return true;
      } else if (recursionStack.has(dep)) {
        return true; // Ciclo detectado
      }
    }

    recursionStack.delete(entity);
    return false;
  }

  for (const dep of ENTITY_DEPENDENCIES) {
    if (!visited.has(dep.entity)) {
      if (hasCycle(dep.entity)) {
        console.error(`Ciclo detectado envolvendo: ${dep.entity}`);
        return false;
      }
    }
  }

  return true;
}