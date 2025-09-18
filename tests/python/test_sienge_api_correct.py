import requests
import json
from datetime import datetime, timedelta
from requests.auth import HTTPBasicAuth

# Credenciais do Sienge
SIENGE_SUBDOMAIN = "abf"
SIENGE_USERNAME = "abf-gfragoso"
SIENGE_PASSWORD = "2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ"

# URL base correta da API Sienge
BASE_URL = f"https://api.sienge.com.br/{SIENGE_SUBDOMAIN}/public/api/v1"

print("="*70)
print("TESTE DE ACESSO A API SIENGE - FORMATO CORRETO")
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

def test_endpoint(name, endpoint, params=None, method="GET"):
    """Testa um endpoint da API Sienge"""
    print(f"\n{'='*70}")
    print(f"Testando: {name}")
    print(f"Endpoint: {endpoint}")
    print(f"URL Completa: {BASE_URL}{endpoint}")
    print(f"Metodo: {method}")
    if params:
        print(f"Parametros: {params}")
    print("-" * 50)

    try:
        url = f"{BASE_URL}{endpoint}"

        if method == "GET":
            response = requests.get(url, auth=auth, headers=headers, params=params, timeout=30)
        else:
            response = requests.post(url, auth=auth, headers=headers, json=params, timeout=30)

        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            print("[SUCESSO] API acessivel!")
            try:
                data = response.json()

                # Analisar estrutura da resposta
                if isinstance(data, dict):
                    if "results" in data:
                        print(f"Estrutura: results + metadata")
                        print(f"Total de registros em 'results': {len(data.get('results', []))}")
                        if "resultSetMetadata" in data:
                            metadata = data["resultSetMetadata"]
                            print(f"Metadata: count={metadata.get('count', 'N/A')}, "
                                  f"offset={metadata.get('offset', 'N/A')}, "
                                  f"limit={metadata.get('limit', 'N/A')}")
                    elif "records" in data:
                        print(f"Estrutura: records")
                        print(f"Total de registros em 'records': {len(data.get('records', []))}")
                    else:
                        print(f"Estrutura: objeto com chaves: {list(data.keys())[:5]}")
                elif isinstance(data, list):
                    print(f"Estrutura: array direto")
                    print(f"Total de registros: {len(data)}")

                # Mostrar amostra dos dados
                if isinstance(data, dict) and "results" in data and len(data["results"]) > 0:
                    print("\nPrimeiro registro (amostra):")
                    print(json.dumps(data["results"][0], indent=2, ensure_ascii=False)[:400] + "...")
                elif isinstance(data, list) and len(data) > 0:
                    print("\nPrimeiro registro (amostra):")
                    print(json.dumps(data[0], indent=2, ensure_ascii=False)[:400] + "...")

            except json.JSONDecodeError:
                print("Resposta nao e JSON valido")
                print(f"Conteudo: {response.text[:300]}...")

        elif response.status_code == 401:
            print("[ERRO 401] Nao autorizado - Credenciais invalidas")
            print(f"Headers de autenticacao: {response.request.headers.get('Authorization', 'Nao encontrado')}")

        elif response.status_code == 403:
            print("[ERRO 403] Proibido - Sem permissao para este recurso")

        elif response.status_code == 404:
            print("[ERRO 404] Endpoint nao encontrado")
            print(f"URL tentada: {url}")

        elif response.status_code == 405:
            print(f"[ERRO 405] Metodo {method} nao permitido para este endpoint")

        else:
            print(f"[AVISO] Status inesperado: {response.status_code}")
            print(f"Resposta: {response.text[:500]}...")

    except requests.exceptions.Timeout:
        print("[ERRO] Timeout na requisicao (30s)")
    except requests.exceptions.ConnectionError as e:
        print(f"[ERRO] Falha na conexao: {e}")
    except Exception as e:
        print(f"[ERRO] Erro inesperado: {type(e).__name__}: {e}")

# Definir datas para testes
end_date = datetime.now().strftime("%Y-%m-%d")
start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

# Lista de endpoints para testar baseado no codigo real
endpoints_to_test = [
    # Endpoints basicos sem parametros obrigatorios
    ("Clientes", "/customers", {"limit": 5, "offset": 0}),
    ("Empresas", "/companies", {"limit": 5, "offset": 0}),
    ("Empreendimentos", "/enterprises", {"limit": 5, "offset": 0}),
    ("Unidades", "/units", {"limit": 5, "offset": 0}),
    ("Contratos de Venda", "/sales-contracts", {"limit": 5, "offset": 0}),
    ("Centros de Custo", "/cost-centers", {"limit": 5, "offset": 0}),

    # Endpoints com parametros de data obrigatorios
    ("Contas a Receber (Income)", "/income", {
        "startDate": start_date,
        "endDate": end_date,
        "selectionType": "D",
        "limit": 5,
        "offset": 0
    }),

    ("Movimentos Bancarios", "/bank-movement", {
        "startDate": start_date,
        "endDate": end_date,
        "limit": 5,
        "offset": 0
    }),

    ("Extrato de Contas", "/accounts-statements", {
        "startDate": start_date,
        "endDate": end_date,
        "limit": 5,
        "offset": 0
    }),

    # Endpoints de configuracao
    ("Tipos de Cliente", "/customer-types", {"limit": 5, "offset": 0}),
    ("Webhooks", "/hooks", {"limit": 5, "offset": 0}),
]

# Testar cada endpoint
for name, endpoint, params in endpoints_to_test:
    test_endpoint(name, endpoint, params)

# Teste especial: verificar estrutura da API
print("\n" + "="*70)
print("TESTE DE DESCOBERTA DE ESTRUTURA")
print("="*70)

discovery_tests = [
    ("API Root", "", None),
    ("Health Check (1 cliente)", "/customers", {"limit": 1}),
]

for name, endpoint, params in discovery_tests:
    test_endpoint(name, endpoint, params)

print("\n" + "="*70)
print("TESTE CONCLUIDO")
print("="*70)
print("\nResumo:")
print(f"- URL Base: {BASE_URL}")
print(f"- Autenticacao: HTTP Basic Auth")
print(f"- Username: {SIENGE_USERNAME}")
print(f"- Subdomain: {SIENGE_SUBDOMAIN}")
print("="*70)