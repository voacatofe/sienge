import requests
import json
from datetime import datetime, timedelta
from requests.auth import HTTPBasicAuth

# Credenciais do Sienge
SIENGE_SUBDOMAIN = "abf"
SIENGE_USERNAME = "abf-gfragoso"
SIENGE_PASSWORD = "2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ"

# URL base do endpoint bills conforme YAML
BASE_URL = f"https://api.sienge.com.br/{SIENGE_SUBDOMAIN}/public/api/v1"

print("="*70)
print("TESTE DO ENDPOINT /bills - TITULOS A PAGAR")
print("="*70)
print(f"Subdomain: {SIENGE_SUBDOMAIN}")
print(f"Username: {SIENGE_USERNAME}")
print(f"Base URL: {BASE_URL}")
print("="*70)

# Headers para requisições
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Sienge-Test/1.0.0"
}

# Autenticação HTTP Basic
auth = HTTPBasicAuth(SIENGE_USERNAME, SIENGE_PASSWORD)

# Definir períodos de teste
test_periods = [
    {
        "name": "Últimos 30 dias",
        "start": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
        "end": datetime.now().strftime("%Y-%m-%d")
    },
    {
        "name": "Último trimestre",
        "start": (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d"),
        "end": datetime.now().strftime("%Y-%m-%d")
    },
    {
        "name": "Ano 2024 completo",
        "start": "2024-01-01",
        "end": "2024-12-31"
    },
    {
        "name": "Janeiro 2025",
        "start": "2025-01-01",
        "end": "2025-01-31"
    }
]

def test_bills_endpoint(period_name, start_date, end_date, additional_params=None):
    """Testa o endpoint /bills com diferentes parâmetros"""
    print(f"\n{'='*70}")
    print(f"Teste: {period_name}")
    print(f"Período: {start_date} até {end_date}")
    print("-" * 50)

    url = f"{BASE_URL}/bills"

    # Parâmetros obrigatórios
    params = {
        "startDate": start_date,
        "endDate": end_date,
        "limit": 10,
        "offset": 0
    }

    # Adicionar parâmetros opcionais se fornecidos
    if additional_params:
        params.update(additional_params)
        print(f"Filtros adicionais: {additional_params}")

    try:
        print(f"URL: {url}")
        print(f"Parâmetros: {json.dumps(params, indent=2)}")

        response = requests.get(url, auth=auth, headers=headers, params=params, timeout=30)

        print(f"\nStatus Code: {response.status_code}")

        if response.status_code == 200:
            print("[SUCESSO] Endpoint acessível!")
            try:
                data = response.json()

                # Analisar estrutura da resposta
                if isinstance(data, dict):
                    if "results" in data:
                        print(f"Total de títulos retornados: {len(data.get('results', []))}")
                        if "resultSetMetadata" in data:
                            metadata = data["resultSetMetadata"]
                            print(f"Metadata:")
                            print(f"  - Total de registros: {metadata.get('count', 'N/A')}")
                            print(f"  - Offset: {metadata.get('offset', 'N/A')}")
                            print(f"  - Limite: {metadata.get('limit', 'N/A')}")

                        # Mostrar resumo dos títulos
                        if data.get('results'):
                            print(f"\nResumo dos títulos encontrados:")
                            for i, bill in enumerate(data['results'][:5], 1):
                                print(f"\n  Título {i}:")
                                print(f"    - ID: {bill.get('id', 'N/A')}")
                                print(f"    - Número Documento: {bill.get('documentNumber', 'N/A')}")
                                print(f"    - Credor: {bill.get('creditorName', bill.get('creditor', 'N/A'))}")
                                print(f"    - Valor: {bill.get('value', bill.get('amount', 'N/A'))}")
                                print(f"    - Status: {bill.get('status', 'N/A')}")
                                print(f"    - Data Emissão: {bill.get('issueDate', bill.get('createdAt', 'N/A'))}")
                                print(f"    - Origem: {bill.get('originId', 'N/A')}")
                    else:
                        print(f"Estrutura de resposta: {list(data.keys())[:10]}")
                elif isinstance(data, list):
                    print(f"Total de títulos retornados (array direto): {len(data)}")
                    if data:
                        print("\nPrimeiro título (amostra):")
                        print(json.dumps(data[0], indent=2, ensure_ascii=False)[:500] + "...")

            except json.JSONDecodeError:
                print("Resposta não é JSON válido")
                print(f"Conteúdo: {response.text[:300]}...")

        elif response.status_code == 401:
            print("[ERRO 401] Não autorizado - Credenciais inválidas")
        elif response.status_code == 403:
            print("[ERRO 403] Proibido - Sem permissão para este recurso")
        elif response.status_code == 404:
            print("[ERRO 404] Endpoint não encontrado")
        elif response.status_code == 400:
            print("[ERRO 400] Requisição inválida - Verifique os parâmetros")
            print(f"Resposta: {response.text[:500]}")
        else:
            print(f"[AVISO] Status inesperado: {response.status_code}")
            print(f"Resposta: {response.text[:500]}...")

    except requests.exceptions.Timeout:
        print("[ERRO] Timeout na requisição (30s)")
    except requests.exceptions.ConnectionError as e:
        print(f"[ERRO] Falha na conexão: {e}")
    except Exception as e:
        print(f"[ERRO] Erro inesperado: {type(e).__name__}: {e}")

# Executar testes básicos
print("\n" + "="*70)
print("INICIANDO TESTES DO ENDPOINT /bills")
print("="*70)

# Teste 1: Sem filtros adicionais
for period in test_periods:
    test_bills_endpoint(period["name"], period["start"], period["end"])

# Teste 2: Com filtros de status
print("\n" + "="*70)
print("TESTES COM FILTROS DE STATUS")
print("="*70)

status_options = [
    ("S", "Completo"),
    ("N", "Incompleto"),
    ("I", "Em inclusão")
]

for status_code, status_name in status_options:
    test_bills_endpoint(
        f"Títulos com status {status_name}",
        "2024-01-01",
        "2024-12-31",
        {"status": status_code}
    )

# Teste 3: Com filtros de origem
print("\n" + "="*70)
print("TESTES COM FILTROS DE ORIGEM")
print("="*70)

origin_options = [
    ("AC", "Administração de Compras"),
    ("CP", "Contas a Pagar"),
    ("SE", "Sistemas Externos")
]

for origin_code, origin_name in origin_options:
    test_bills_endpoint(
        f"Títulos origem {origin_name}",
        "2024-01-01",
        "2024-12-31",
        {"originId": origin_code}
    )

print("\n" + "="*70)
print("TESTE CONCLUÍDO")
print("="*70)