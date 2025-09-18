import requests
import json
from datetime import datetime, timedelta
from requests.auth import HTTPBasicAuth
from typing import Dict, List, Any, Tuple
import time

# Credenciais do Sienge
SIENGE_SUBDOMAIN = "abf"
SIENGE_USERNAME = "abf-gfragoso"
SIENGE_PASSWORD = "2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ"

# URLs base
BASE_URL_V1 = f"https://api.sienge.com.br/{SIENGE_SUBDOMAIN}/public/api/v1"
BASE_URL_BULK = f"https://api.sienge.com.br/{SIENGE_SUBDOMAIN}/public/api/bulk-data/v1"

# Headers e autenticação
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Sienge-Test/1.0.0"
}
auth = HTTPBasicAuth(SIENGE_USERNAME, SIENGE_PASSWORD)

# Estatísticas globais
stats = {
    "total_tested": 0,
    "successful": 0,
    "failed_404": 0,
    "failed_403": 0,
    "failed_400": 0,
    "failed_401": 0,
    "failed_other": 0,
    "total_records": 0
}

# Resultados detalhados
results = []

def get_date_params():
    """Retorna parâmetros de data padrão"""
    return {
        "end_date": datetime.now().strftime("%Y-%m-%d"),
        "start_date": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
        "month_year": datetime.now().strftime("%m/%Y")
    }

def test_endpoint(name: str, base_url: str, endpoint: str, params: Dict[str, Any],
                 method: str = "GET") -> Tuple[int, Dict[str, Any]]:
    """Testa um endpoint específico"""
    url = f"{base_url}{endpoint}"
    stats["total_tested"] += 1

    result = {
        "name": name,
        "endpoint": endpoint,
        "url": url,
        "params": params,
        "status": None,
        "records": 0,
        "error": None,
        "response_structure": None
    }

    try:
        if method == "GET":
            response = requests.get(url, auth=auth, headers=headers, params=params, timeout=30)
        else:
            response = requests.post(url, auth=auth, headers=headers, json=params, timeout=30)

        result["status"] = response.status_code

        if response.status_code == 200:
            stats["successful"] += 1
            try:
                data = response.json()

                # Analisar estrutura
                if isinstance(data, dict):
                    if "results" in data:
                        result["records"] = len(data.get("results", []))
                        result["response_structure"] = "results + metadata"
                        if "resultSetMetadata" in data:
                            meta = data["resultSetMetadata"]
                            result["total_available"] = meta.get("count", 0)
                    elif "records" in data:
                        result["records"] = len(data.get("records", []))
                        result["response_structure"] = "records"
                    else:
                        result["response_structure"] = f"object with keys: {list(data.keys())[:5]}"
                elif isinstance(data, list):
                    result["records"] = len(data)
                    result["response_structure"] = "array"

                stats["total_records"] += result["records"]

            except json.JSONDecodeError:
                result["error"] = "Invalid JSON response"

        elif response.status_code == 401:
            stats["failed_401"] += 1
            result["error"] = "Unauthorized"
        elif response.status_code == 403:
            stats["failed_403"] += 1
            result["error"] = "Forbidden - No permission"
        elif response.status_code == 404:
            stats["failed_404"] += 1
            result["error"] = "Not found"
        elif response.status_code == 400:
            stats["failed_400"] += 1
            result["error"] = f"Bad request: {response.text[:200]}"
        else:
            stats["failed_other"] += 1
            result["error"] = f"Status {response.status_code}"

    except requests.exceptions.Timeout:
        result["error"] = "Timeout"
        stats["failed_other"] += 1
    except requests.exceptions.ConnectionError as e:
        result["error"] = f"Connection error: {str(e)[:100]}"
        stats["failed_other"] += 1
    except Exception as e:
        result["error"] = f"Error: {str(e)[:100]}"
        stats["failed_other"] += 1

    results.append(result)
    return result["status"], result

def print_test_result(result: Dict[str, Any]):
    """Imprime resultado de um teste"""
    status_symbol = "[OK]" if result["status"] == 200 else f"[{result['status'] or 'ERR'}]"
    print(f"{status_symbol:8} {result['name']:40} | Records: {result['records']:5} | {result['error'] or 'Success'}")

def main():
    print("="*80)
    print("TESTE ABRANGENTE DE TODOS OS ENDPOINTS DA API SIENGE")
    print("="*80)
    print(f"Subdomain: {SIENGE_SUBDOMAIN}")
    print(f"Username: {SIENGE_USERNAME}")
    print(f"Timestamp: {datetime.now()}")
    print("="*80)

    dates = get_date_params()

    # Define todos os endpoints a testar
    all_endpoints = [
        # === ENDPOINTS BÁSICOS (sem parâmetros obrigatórios) ===
        ("Clientes", BASE_URL_V1, "/customers", {"limit": 5, "offset": 0}),
        ("Empresas", BASE_URL_V1, "/companies", {"limit": 5, "offset": 0}),
        ("Empreendimentos", BASE_URL_V1, "/enterprises", {"limit": 5, "offset": 0}),
        ("Unidades", BASE_URL_V1, "/units", {"limit": 5, "offset": 0}),
        ("Contratos de Venda", BASE_URL_V1, "/sales-contracts", {"limit": 5, "offset": 0}),
        ("Credores", BASE_URL_V1, "/creditors", {"limit": 5, "offset": 0}),
        ("Tipos de Cliente", BASE_URL_V1, "/customer-types", {"limit": 5, "offset": 0}),
        ("Indexadores", BASE_URL_V1, "/indexers", {"limit": 5, "offset": 0}),
        ("Webhooks", BASE_URL_V1, "/hooks", {"limit": 5, "offset": 0}),
        ("Sites", BASE_URL_V1, "/sites", {"limit": 5, "offset": 0}),
        ("Contas Correntes", BASE_URL_V1, "/checking-accounts", {"limit": 5, "offset": 0}),
        ("Centros de Custo", BASE_URL_V1, "/cost-centers", {"limit": 5, "offset": 0}),

        # === ENDPOINTS COM DATA OBRIGATÓRIA ===
        ("Títulos a Pagar", BASE_URL_V1, "/bills", {
            "startDate": dates["start_date"],
            "endDate": dates["end_date"],
            "limit": 5,
            "offset": 0
        }),
        ("Extrato de Contas", BASE_URL_V1, "/accounts-statements", {
            "startDate": dates["start_date"],
            "endDate": dates["end_date"],
            "limit": 5,
            "offset": 0
        }),
        ("Saldos de Contas", BASE_URL_V1, "/accounts-balances", {
            "balanceDate": dates["end_date"],
            "limit": 5,
            "offset": 0
        }),

        # === BULK DATA ENDPOINTS ===
        ("Income (Bulk)", BASE_URL_BULK, "/income", {
            "startDate": dates["start_date"],
            "endDate": dates["end_date"],
            "selectionType": "D",
            "limit": 5,
            "offset": 0
        }),
        ("Income (API V1)", BASE_URL_V1, "/income", {
            "startDate": dates["start_date"],
            "endDate": dates["end_date"],
            "selectionType": "D",
            "limit": 5,
            "offset": 0
        }),
        ("Movimentos Bancários (Bulk)", BASE_URL_BULK, "/bank-movement", {
            "startDate": dates["start_date"],
            "endDate": dates["end_date"],
            "limit": 5,
            "offset": 0
        }),
        ("Extrato Cliente (Bulk)", BASE_URL_BULK, "/customer-extract-history", {
            "startDueDate": dates["start_date"],
            "endDueDate": dates["end_date"],
            "limit": 5,
            "offset": 0
        }),
        ("Vendas (Bulk)", BASE_URL_BULK, "/sales", {
            "enterpriseId": 1,  # Teste com ID 1
            "createdAfter": dates["start_date"],
            "createdBefore": dates["end_date"],
            "situation": "SOLD",
            "limit": 5,
            "offset": 0
        }),

        # === ENDPOINTS COM OUTROS PARÂMETROS OBRIGATÓRIOS ===
        ("Comissões", BASE_URL_V1, "/commissions", {
            "offset": 0,
            "limit": 5
        }),
        ("Fechamento Contábil", BASE_URL_V1, "/closingaccountancy", {
            "monthYear": dates["month_year"],
            "limit": 5,
            "offset": 0
        }),
        ("Lançamentos Contábeis", BASE_URL_V1, "/accountancy/entries", {
            "companyId": 1,  # Teste com ID 1
            "limit": 5,
            "offset": 0
        }),
        ("Contas Contábeis", BASE_URL_V1, "/accountancy/accounts", {
            "limit": 5,
            "offset": 0
        }),

        # === PATRIMÔNIO ===
        ("Bens Imóveis", BASE_URL_V1, "/patrimony/fixed", {"limit": 5, "offset": 0}),
        ("Bens Móveis", BASE_URL_V1, "/patrimony/movable", {"limit": 5, "offset": 0}),

        # === CONSTRUÇÃO ===
        ("Diário de Obra", BASE_URL_V1, "/construction-daily-report", {"limit": 5, "offset": 0}),
        ("Tipos de Diário", BASE_URL_V1, "/construction-daily-report/types", {"limit": 5, "offset": 0}),
        ("Tipos de Ocorrência", BASE_URL_V1, "/construction-daily-report/event-type", {"limit": 5, "offset": 0}),
        ("Registro de Medições", BASE_URL_V1, "/building-projects/progress-logs", {"limit": 5, "offset": 0}),

        # === CONTRATOS ===
        ("Contratos Suprimento", BASE_URL_V1, "/supply-contracts/all", {"limit": 5, "offset": 0}),
        ("Medições Contratos", BASE_URL_V1, "/supply-contracts/measurements/all", {"limit": 5, "offset": 0}),
        ("Anexos Medições", BASE_URL_V1, "/supply-contracts/measurements/attachments/all", {
            "measurementStartDate": dates["start_date"],
            "measurementEndDate": dates["end_date"],
            "limit": 5,
            "offset": 0
        }),

        # === OUTROS ===
        ("Locação de Imóveis", BASE_URL_V1, "/property-rental", {"limit": 5, "offset": 0}),
        ("Contas a Receber", BASE_URL_V1, "/accounts-receivable", {"limit": 5, "offset": 0}),
        ("Características Unidades", BASE_URL_V1, "/units/characteristics", {"limit": 5, "offset": 0}),
        ("Situações Unidades", BASE_URL_V1, "/units/situations", {"limit": 5, "offset": 0}),

        # === ENDPOINTS ADICIONAIS POSSÍVEIS ===
        ("Projetos", BASE_URL_V1, "/projects", {"limit": 5, "offset": 0}),
        ("Notas Eletrônicas", BASE_URL_V1, "/eletronic-invoice-bills", {"limit": 5, "offset": 0}),
        ("Condomínios", BASE_URL_V1, "/condominiums", {"limit": 5, "offset": 0}),
        ("Portadores", BASE_URL_V1, "/bearers", {"limit": 5, "offset": 0}),
        ("Documentos", BASE_URL_V1, "/documents", {"limit": 5, "offset": 0}),
    ]

    print(f"\nTestando {len(all_endpoints)} endpoints...\n")
    print("-"*80)

    # Testar cada endpoint
    for name, base_url, endpoint, params in all_endpoints:
        status, result = test_endpoint(name, base_url, endpoint, params)
        print_test_result(result)
        time.sleep(0.3)  # Pequena pausa para evitar rate limiting

    # Imprimir relatório final
    print("\n" + "="*80)
    print("RELATÓRIO FINAL")
    print("="*80)

    print(f"\nESTATÍSTICAS GERAIS:")
    print(f"  Total de endpoints testados: {stats['total_tested']}")
    print(f"  Endpoints bem-sucedidos (200): {stats['successful']}")
    print(f"  Endpoints não encontrados (404): {stats['failed_404']}")
    print(f"  Sem permissão (403): {stats['failed_403']}")
    print(f"  Requisição inválida (400): {stats['failed_400']}")
    print(f"  Não autorizado (401): {stats['failed_401']}")
    print(f"  Outros erros: {stats['failed_other']}")
    print(f"  Total de registros retornados: {stats['total_records']}")

    # Listar endpoints funcionais
    print(f"\nENDPOINTS FUNCIONAIS ({stats['successful']}):")
    for result in results:
        if result["status"] == 200:
            print(f"  [OK] {result['name']:30} - {result['records']} registros")

    # Listar endpoints com problemas de permissão
    forbidden = [r for r in results if r["status"] == 403]
    if forbidden:
        print(f"\nENDPOINTS SEM PERMISSAO ({len(forbidden)}):")
        for result in forbidden:
            print(f"  [403] {result['name']:30} - Acesso negado")

    # Listar endpoints não encontrados
    not_found = [r for r in results if r["status"] == 404]
    if not_found:
        print(f"\nENDPOINTS NAO ENCONTRADOS ({len(not_found)}):")
        for result in not_found:
            print(f"  [404] {result['name']:30} - Endpoint nao existe")

    # Taxa de sucesso
    if stats['total_tested'] > 0:
        success_rate = (stats['successful'] / stats['total_tested']) * 100
        print(f"\nTAXA DE SUCESSO: {success_rate:.1f}%")

    # Salvar resultados em arquivo JSON
    with open("test_results.json", "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "subdomain": SIENGE_SUBDOMAIN,
            "stats": stats,
            "results": results
        }, f, indent=2, ensure_ascii=False)

    print("\nResultados salvos em: test_results.json")
    print("="*80)

if __name__ == "__main__":
    main()