#!/usr/bin/env python3
"""
Script para testar todos os endpoints da API Sienge e verificar quais estão acessíveis
"""

import requests
import json
import yaml
import os
from typing import Dict, List, Tuple
from datetime import datetime
import time
from pathlib import Path

# Configurações da API
SIENGE_SUBDOMAIN = "abf"
SIENGE_USERNAME = "abf-gfragoso"
SIENGE_PASSWORD = "2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ"
BASE_URL = f"https://{SIENGE_SUBDOMAIN}.sienge.com.br/{SIENGE_SUBDOMAIN}/api/v1"

# Diretório com os YAMLs
YAML_DIR = "C:/Users/darla/OneDrive/Documentos/sienge/api-docs-plus/sienge_yamls_updated"

# Headers para autenticação
headers = {
    "Authorization": f"Basic {SIENGE_USERNAME}:{SIENGE_PASSWORD}",
    "Content-Type": "application/json"
}

# Mapeamento de endpoints conhecidos
ENDPOINT_MAPPINGS = {
    "customers-v1": "/customers",
    "customer-types-v1": "/customer-types",
    "enterprise-v1": "/enterprises",
    "unit-v1": "/units",
    "sales-contracts-v1": "/sales-contracts",
    "contracts-v1": "/contracts",
    "company-v1": "/companies",
    "creditor-v1": "/creditors",
    "accounts-receivable-v1": "/accounts-receivable",
    "accounts-statements-v1": "/accounts-statements",
    "bill-debt-v1": "/bills",
    "commissions-v1": "/commissions",
    "cost-center-v1": "/cost-centers",
    "checking-accounts-v1": "/checking-accounts",
    "indexers-v1": "/indexers",
    "hooks-v1": "/hooks",
    "accountancy-accounts-v1": "/accountancy-accounts",
    "accountancy-closingaccountancy-v1": "/accountancy-closing",
    "accountancy-entries-v1": "/accountancy-entries",
    "accounts-balances-v1": "/accounts-balances",
    "building-projects-progress-logs-v1": "/building-projects/progress-logs",
    "bulk-data-bank-movement-v1": "/bulk-data/bank-movements",
    "bulk-data-building-cost-estimations-v1": "/bulk-data/building-cost-estimations",
    "bulk-data-customer-extract-history-v1": "/bulk-data/customer-extract-history",
    "bulk-data-income-v1": "/bulk-data/income",
    "bulk-data-sales-v1": "/bulk-data/sales",
    "construction-daily-report-v1": "/construction-daily-reports",
    "fixed-assets-v1": "/fixed-assets",
    "measurement-v1": "/measurements",
    "movable-assets-v1": "/movable-assets",
    "property-rental-v1": "/property-rentals",
    "sites-v1": "/sites",
}

def test_endpoint(endpoint_name: str, endpoint_path: str) -> Tuple[str, int, str, int]:
    """
    Testa um endpoint específico

    Returns:
        Tuple com (endpoint_name, status_code, message, record_count)
    """
    try:
        # Adiciona parâmetros de paginação
        url = f"{BASE_URL}{endpoint_path}"
        params = {
            "limit": 1,  # Busca apenas 1 registro para teste rápido
            "offset": 0
        }

        print(f"Testando: {endpoint_name} -> {url}")

        # Faz a requisição
        response = requests.get(url, headers=headers, params=params, timeout=10)

        if response.status_code == 200:
            try:
                data = response.json()
                # Tenta contar registros
                record_count = 0
                if isinstance(data, list):
                    record_count = len(data)
                elif isinstance(data, dict):
                    # Verifica se tem campo results, items, data, etc
                    for field in ['results', 'items', 'data', 'records', 'content']:
                        if field in data and isinstance(data[field], list):
                            record_count = len(data[field])
                            break
                    else:
                        # Se não encontrou lista, conta como 1 registro
                        record_count = 1 if data else 0

                return (endpoint_name, response.status_code, "✅ Acesso liberado", record_count)
            except:
                return (endpoint_name, response.status_code, "✅ Acesso liberado (não JSON)", 0)
        elif response.status_code == 401:
            return (endpoint_name, response.status_code, "❌ Não autorizado", 0)
        elif response.status_code == 403:
            return (endpoint_name, response.status_code, "🔒 Acesso negado", 0)
        elif response.status_code == 404:
            return (endpoint_name, response.status_code, "⚠️ Endpoint não encontrado", 0)
        else:
            return (endpoint_name, response.status_code, f"⚠️ Status: {response.status_code}", 0)

    except requests.exceptions.Timeout:
        return (endpoint_name, 0, "⏱️ Timeout", 0)
    except Exception as e:
        return (endpoint_name, 0, f"❌ Erro: {str(e)[:50]}", 0)

def extract_endpoints_from_yaml(yaml_file: str) -> List[str]:
    """
    Extrai os endpoints de um arquivo YAML
    """
    try:
        with open(yaml_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        endpoints = []
        if 'paths' in data:
            for path in data['paths'].keys():
                endpoints.append(path)

        return endpoints
    except:
        return []

def main():
    print("=" * 80)
    print("TESTE DE TODOS OS ENDPOINTS DA API SIENGE")
    print("=" * 80)
    print(f"Subdomínio: {SIENGE_SUBDOMAIN}")
    print(f"Usuário: {SIENGE_USERNAME}")
    print(f"Base URL: {BASE_URL}")
    print("=" * 80)
    print()

    results = []

    # Testa endpoints conhecidos
    print("Testando endpoints conhecidos...")
    print("-" * 40)
    for endpoint_name, endpoint_path in ENDPOINT_MAPPINGS.items():
        result = test_endpoint(endpoint_name, endpoint_path)
        results.append(result)
        time.sleep(0.5)  # Pequeno delay entre requisições

    # Tenta descobrir novos endpoints dos YAMLs
    print("\n" + "=" * 80)
    print("Tentando descobrir novos endpoints dos arquivos YAML...")
    print("-" * 40)

    yaml_files = list(Path(YAML_DIR).glob("*.yaml"))
    discovered_endpoints = set()

    for yaml_file in yaml_files:
        endpoints = extract_endpoints_from_yaml(str(yaml_file))
        for endpoint in endpoints:
            if endpoint not in discovered_endpoints:
                discovered_endpoints.add(endpoint)
                # Testa se não foi testado ainda
                endpoint_name = f"discovered_{yaml_file.stem}_{endpoint}"
                if not any(r[0] == endpoint_name for r in results):
                    result = test_endpoint(endpoint_name, endpoint)
                    results.append(result)
                    time.sleep(0.5)

    # Resumo dos resultados
    print("\n" + "=" * 80)
    print("RESUMO DOS RESULTADOS")
    print("=" * 80)

    # Agrupa por status
    accessible = [r for r in results if "✅" in r[2]]
    denied = [r for r in results if "🔒" in r[2] or "❌" in r[2]]
    not_found = [r for r in results if "⚠️" in r[2]]

    print(f"\n📊 ESTATÍSTICAS:")
    print(f"Total de endpoints testados: {len(results)}")
    print(f"✅ Acessíveis: {len(accessible)}")
    print(f"🔒 Acesso negado: {len(denied)}")
    print(f"⚠️ Não encontrados/Outros: {len(not_found)}")

    if accessible:
        print(f"\n✅ ENDPOINTS ACESSÍVEIS ({len(accessible)}):")
        print("-" * 40)
        for name, status, msg, count in sorted(accessible):
            print(f"  • {name}: {msg} (registros encontrados: {count})")

    if denied:
        print(f"\n🔒 ENDPOINTS COM ACESSO NEGADO ({len(denied)}):")
        print("-" * 40)
        for name, status, msg, count in sorted(denied):
            print(f"  • {name}: {msg}")

    if not_found:
        print(f"\n⚠️ ENDPOINTS NÃO ENCONTRADOS/OUTROS ({len(not_found)}):")
        print("-" * 40)
        for name, status, msg, count in sorted(not_found):
            print(f"  • {name}: {msg}")

    # Salva resultados em JSON
    output_file = "endpoint_test_results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            "test_date": datetime.now().isoformat(),
            "subdomain": SIENGE_SUBDOMAIN,
            "username": SIENGE_USERNAME,
            "total_tested": len(results),
            "accessible_count": len(accessible),
            "denied_count": len(denied),
            "not_found_count": len(not_found),
            "results": [
                {
                    "endpoint": r[0],
                    "status_code": r[1],
                    "message": r[2],
                    "record_count": r[3],
                    "accessible": "✅" in r[2]
                }
                for r in results
            ]
        }, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Resultados salvos em: {output_file}")

    # Compara com endpoints já implementados
    print("\n" + "=" * 80)
    print("COMPARAÇÃO COM ENDPOINTS JÁ IMPLEMENTADOS")
    print("=" * 80)

    # Endpoints já implementados no sistema
    implemented_endpoints = [
        "customers",
        "companies",
        "sales-contracts",
        "enterprises",
        "units",
        "hooks",
        "creditors",
        "bills",
        "accounts-statements",
        "supply-contracts/all"
    ]

    print("\n📋 Endpoints já implementados no sistema:")
    for endpoint in implemented_endpoints:
        # Verifica se está acessível
        is_accessible = any(endpoint in r[0] and "✅" in r[2] for r in results)
        status = "✅ Acessível" if is_accessible else "🔒 Sem acesso"
        print(f"  • {endpoint}: {status}")

    # Identifica novos endpoints disponíveis mas não implementados
    print("\n🆕 Novos endpoints acessíveis mas NÃO implementados:")
    print("-" * 40)

    new_endpoints = []
    for name, status, msg, count in accessible:
        # Remove prefixos e normaliza nome
        clean_name = name.replace("-v1", "").replace("_", "-")

        # Verifica se não está na lista de implementados
        is_implemented = any(impl in clean_name for impl in implemented_endpoints)

        if not is_implemented:
            new_endpoints.append((name, count))
            print(f"  • {name} (registros: {count})")

    if not new_endpoints:
        print("  Nenhum novo endpoint encontrado")

    print("\n" + "=" * 80)
    print("TESTE CONCLUÍDO!")
    print("=" * 80)

if __name__ == "__main__":
    main()