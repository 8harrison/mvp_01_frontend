// Lógica principal da aplicação
class App {
    static init() {
        // Configurar navegação
        document.querySelectorAll('.section-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                App.showSection(sectionId);
            });
        });
        
        // Configurar formulários
        document.getElementById('loginForm')?.addEventListener('submit', Auth.handleLogin);
        document.getElementById('registerForm')?.addEventListener('submit', Auth.handleRegister);
        document.getElementById('addMovimentacaoBtn')?.addEventListener('click', Movimentacoes.showAddMovimentacaoModal);
        document.getElementById('saveMovimentacaoBtn')?.addEventListener('click', Movimentacoes.saveMovimentacao);
        
        // Configurar filtros
        document.querySelectorAll('.filter-buttons button')?.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                Movimentacoes.filterMovimentacoes(filter);
                
                // Ativar botão selecionado
                document.querySelectorAll('.filter-buttons button').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
        
        // Verificar autenticação
        Auth.checkAuth();
        
        // Mostrar a seção de login por padrão se não estiver autenticado
        if (!window.currentUser) {
            App.showSection('login');
        }
    }
    
    static async showSection(sectionId) {
        // Carregar o conteúdo da seção
        try {
            const response = await fetch(`partials/${sectionId}.html`);
            const content = await response.text();
            
            document.getElementById('main-content').innerHTML = content;
            
            // Reconfigurar event listeners para os elementos carregados dinamicamente
            if (sectionId === 'login') {
                document.getElementById('loginForm').addEventListener('submit', Auth.handleLogin);
            } else if (sectionId === 'registro') {
                document.getElementById('registerForm').addEventListener('submit', Auth.handleRegister);
            } else if (sectionId === 'dashboard') {
                document.getElementById('addMovimentacaoBtn').addEventListener('click', Movimentacoes.showAddMovimentacaoModal);
                
                // Configurar filtros
                document.querySelectorAll('.filter-buttons button').forEach(button => {
                    button.addEventListener('click', function() {
                        const filter = this.getAttribute('data-filter');
                        Movimentacoes.filterMovimentacoes(filter);
                        
                        document.querySelectorAll('.filter-buttons button').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        this.classList.add('active');
                    });
                });
                
                // Carregar movimentações se o usuário estiver autenticado
                if (window.currentUser) {
                    Movimentacoes.loadMovimentacoes();
                }
            }
        } catch (error) {
            console.error('Erro ao carregar a seção:', error);
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', App.init);

// Funções globais para uso nos event listeners
window.editMovimentacao = Movimentacoes.editMovimentacao;
window.deleteMovimentacao = Movimentacoes.deleteMovimentacao;