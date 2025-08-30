const API_BASE_URL = "http://localhost:5000";
const CREATE_MOV_URL = `${API_BASE_URL}/adicionar_movimentacao`;
const UPDATE_MOV_URL = `${API_BASE_URL}/atualizar_movimentacao`;
const GET_MOV_URL = `${API_BASE_URL}/listar_movimentacoes`;
const DELETE_MOV_URL = `${API_BASE_URL}/excluir_movimentacao`;
const AUTH_USER_URL = `${API_BASE_URL}/autenticar_usuario`

const HEADERS = { "Content-Type": "application/json" };

const PUT = "PUT";
const POST = "POST";
const DELETE = "DELETE";

const ERRO_CONEXAO = "Erro de conexão. Tente novamente.";
const ERRO_DESCONHECIDO = "Erro desconhecido.";
const ERRO_CAR_MOV = "Erro ao carregar movimentações.";
const ERRO = "Erro: ";
const ERRO_LOGIN = "Erro ao fazer login";

const MODAL_ID = "modalTitle";
const VALOR_ID = "valor";
const TIPO_ID = "tipo";
const DATA_MOVIMENTACAO_ID = "data_movimentacao";
const CATEGORIA_ID = "categoria";
const DESCRICAO_ID = "descricao";
const CONTRAPARTE_ID = "contraparte";
const MOV_MOD_ID = "movimentacaoModal";
const MOV_FOR_ID = "movimentacaoForm";

const CONF_EXCL_MOV = "Tem certeza que deseja excluir esta movimentação?";
const ADD_MOV_TXT = "Adicionar Movimentação";
const UPD_MOV_TXT = "Editar Movimentação";
