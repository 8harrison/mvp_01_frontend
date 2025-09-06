# 📊 Sistema de Gestão Financeira – Frontend

Este é o **frontend** do Sistema de Gestão Financeira, desenvolvido em **HTML, CSS e JavaScript puro** com integração a um backend em **Flask**.  
O projeto permite que usuários façam **login, cadastro, gestão de movimentações financeiras** (entradas e saídas), visualização de **resumos mensais** e **gráficos interativos com Chart.js**.

---

## 🚀 Funcionalidades
- Login e Registro de Usuários.
- Dashboard com listagem de movimentações.
- Filtros de movimentações por tipo.
- Gráficos interativos (entradas vs saídas e categorias).
- Resumos financeiros mensais.

---

## ⚙️ Instalação e Configuração

### 1. Pré-requisitos
- Navegador moderno (Google Chrome, Firefox, Edge).
- Servidor backend em Flask rodando localmente (porta `5000` por padrão).

### 2. Clonar o repositório
```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/8harrison/mvp_01_frontend)
cd seu-repositorio/mvp_01_frontend
````

### 3. Estrutura de Arquivos

```plaintext
mvp_01_frontend/
│── index.html
│── login.html
│── registro.html
│── dashboard.html
│── resumos.html
│
├── js/
│   ├── navbar.js
│   ├── login.js
│   ├── registro.js
│   ├── dashboard.js
│   └── resumos.js
│
├── components/
│   ├── MovimentacaoCard.js
│
├── css/
│   └── styles.css
```

### 4. Executar o projeto

Como o frontend é **puro HTML + JS**, não há necessidade de build.
Basta abrir o arquivo `index.html` diretamente no navegador.

## 🛠️ Dependências

O frontend utiliza as seguintes bibliotecas externas via CDN:

* [Bootstrap 5](https://getbootstrap.com/) (layout e componentes responsivos).
* [Font Awesome](https://fontawesome.com/) (ícones).
* [Chart.js](https://www.chartjs.org/) (gráficos).

Exemplo de inclusão no HTML:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

---

## ▶️ Fluxo de Uso

1. Acesse `login.html` ou `registro.html` para autenticação.
2. Após login, o usuário é redirecionado para `dashboard.html`.
3. No dashboard, é possível **listar, editar e excluir movimentações**.
4. O menu “Resumos” leva até `resumos.html`, onde o usuário pode visualizar **gráficos de entradas/saídas** e **categorias de despesas**.

---

## 📌 Observações

* Certifique-se de que o **backend Flask** esteja rodando em `http://localhost:5000`.
* O `usuario_id` é salvo no **LocalStorage** após login e usado para todas as requisições.
* Caso queira usar em produção, configure corretamente o **CORS** no backend.

---

## 👨‍💻 Autor

Projeto desenvolvido por **Harrison Monteiro de Oliveira**.
