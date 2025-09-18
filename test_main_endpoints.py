#!/usr/bin/env python3
"""
Script para testar os principais endpoints da API Sienge
"""

import requests
import json
from datetime import datetime
import time

# Configurações da API
SIENGE_SUBDOMAIN = "abf"
SIENGE_USERNAME = "abf-gfragoso"
SIENGE_PASSWORD = "2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ"
BASE_URL = f"https://api.sienge.com.br/{SIENGE_SUBDOMAIN}/public/api/v1"

# Headers para autenticação
auth_string = f"{SIENGE_USERNAME}:{SIENGE_PASSWORD}"
import base64
auth_encoded = base64.b64encode(auth_string.encode()).decode()

headers = {
    "Authorization": f"Basic {auth_encoded}",
    "Content-Type": "application/json"
}

# Lista dos principais endpoints para testar
MAIN_ENDPOINTS = {
    # Já implementados no sistema
    "customers": "/customers",
    "companies": "/companies",
    "sales-contracts": "/sales-contracts",
    "enterprises": "/enterprises",
    "units": "/units",
    "hooks": "/hooks",
    "creditors": "/creditors",
    "bills": "/bills",
    "accounts-statements": "/accounts-statements",
    "supply-contracts": "/supply-contracts/all",

    # Novos endpoints potenciais
    "customer-types": "/customer-types",
    "accounts-receivable": "/accounts-receivable",
    "accounts-receivable-bills": "/accounts-receivable/receivable-bills",
    "commissions": "/commissions",
    "cost-centers": "/cost-centers",
    "checking-accounts": "/checking-accounts",
    "indexers": "/indexers",
    "accountancy-accounts": "/accountancy/accounts",
    "accountancy-entries": "/accountancy/entries",
    "accounts-balances": "/accounts-balances",
    "building-projects": "/building-projects/progress-logs",
    "construction-daily-reports": "/construction-daily-reports",
    "fixed-assets": "/fixed-assets",
    "measurements": "/measurements",
    "movable-assets": "/movable-assets",
    "property-rentals": "/property-rentals",
    "sites": "/sites",

    # Endpoints bulk data
    "bulk-bank-movements": "/bulk-data/bank-movements",
    "bulk-building-costs": "/bulk-data/building-cost-estimations",
    "bulk-customer-history": "/bulk-data/customer-extract-history",
    "bulk-income": "/bulk-data/income",
    "bulk-sales": "/bulk-data/sales",
}

def test_endpoint(name, path):
    """Testa um endpoint específico"""
    try:
        url = f"{BASE_URL}{path}"
        params = {"limit": 1, "offset": 0}

        response = requests.get(url, headers=headers, params=params, timeout=5)

        if response.status_code == 200:
            try:
                data = response.json()
                # Conta registros
                count = 0
                if isinstance(data, list):
                    count = len(data)
                elif isinstance(data, dict):
                    for field in ['results', 'items', 'data', 'records', 'content']:
                        if field in data and isinstance(data[field], list):
                            count = len(data[field])
                            break
                    else:
                        count = 1 if data else 0
                return {"status": "✅", "code": 200, "message": "Acesso liberado", "count": count}
            except:
                return {"status": "✅", "code": 200, "message": "Acesso liberado (não JSON)", "count": 0}
        elif response.status_code == 401:
            return {"status": "❌", "code": 401, "message": "Não autorizado", "count": 0}
        elif response.status_code == 403:
            return {"status": "🔒", "code": 403, "message": "Acesso negado", "count": 0}
        elif response.status_code == 404:
            return {"status": "⚠️", "code": 404, "message": "Não encontrado", "count": 0}
        else:
            return {"status": "⚠️", "code": response.status_code, "message": f"Status {response.status_code}", "count": 0}
    except requests.exceptions.Timeout:
        return {"status": "⏱️", "code": 0, "message": "Timeout", "count": 0}
    except Exception as e:
        return {"status": "❌", "code": 0, "message": str(e)[:50], "count": 0}

def main():
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("=" * 80)
    print("TESTE DOS PRINCIPAIS ENDPOINTS DA API SIENGE")
    print("=" * 80)
    print(f"Subdomínio: {SIENGE_SUBDOMAIN}")
    print(f"Base URL: {BASE_URL}")
    print("=" * 80)
    print()

    results = {}

    # Testa cada endpoint
    for name, path in MAIN_ENDPOINTS.items():
        print(f"Testando {name}...", end=" ", flush=True)
        result = test_endpoint(name, path)
        results[name] = result
        print(f"{result['status']} {result['message']}")
        time.sleep(0.2)  # Pequeno delay entre requisições

    # Análise dos resultados
    print("\n" + "=" * 80)
    print("RESUMO DOS RESULTADOS")
    print("=" * 80)

    accessible = {k: v for k, v in results.items() if v['status'] == "✅"}
    denied = {k: v for k, v in results.items() if v['status'] in ["🔒", "❌"]}
    not_found = {k: v for k, v in results.items() if v['status'] == "⚠️"}

    print(f"\n📊 ESTATÍSTICAS:")
    print(f"Total testados: {len(results)}")
    print(f"✅ Acessíveis: {len(accessible)}")
    print(f"🔒 Negados: {len(denied)}")
    print(f"⚠️ Não encontrados: {len(not_found)}")

    # Endpoints já implementados
    implemented = [
        "customers", "companies", "sales-contracts", "enterprises",
        "units", "hooks", "creditors", "bills", "accounts-statements",
        "supply-contracts"
    ]

    print("\n✅ ENDPOINTS ACESSÍVEIS:")
    print("-" * 40)
    for name in sorted(accessible.keys()):
        impl = "📌 JÁ IMPLEMENTADO" if name in implemented else "🆕 NOVO"
        print(f"  {name:30} {impl}")

    print("\n🆕 NOVOS ENDPOINTS DISPONÍVEIS (não implementados):")
    print("-" * 40)
    new_available = [k for k in accessible.keys() if k not in implemented]
    if new_available:
        for name in sorted(new_available):
            print(f"  • {name}")
    else:
        print("  Nenhum novo endpoint disponível")

    print("\n🔒 ENDPOINTS SEM ACESSO:")
    print("-" * 40)
    for name in sorted(denied.keys()):
        impl = "📌 IMPLEMENTADO" if name in implemented else ""
        print(f"  {name:30} {impl}")

    print("\n⚠️ ENDPOINTS NÃO ENCONTRADOS:")
    print("-" * 40)
    for name in sorted(not_found.keys()):
        print(f"  • {name}")

    # Salva resultados
    output = {
        "test_date": datetime.now().isoformat(),
        "subdomain": SIENGE_SUBDOMAIN,
        "statistics": {
            "total": len(results),
            "accessible": len(accessible),
            "denied": len(denied),
            "not_found": len(not_found)
        },
        "results": results,
        "new_available_endpoints": new_available,
        "implemented_endpoints_status": {
            name: results.get(name, {"status": "não testado"})["status"]
            for name in implemented
        }
    }

    with open("endpoint_test_summary.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Resultados salvos em: endpoint_test_summary.json")
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()