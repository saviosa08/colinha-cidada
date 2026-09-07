/**
 * Módulo de Métricas e Registro de Estatísticas de Download
 */
class MetricsService {
    constructor(config) {
        this.config = config;
        this.storageKey = 'colinha_cidada_metrics_v1';
    }

    /**
     * Gera um ID único para o download (UUIDv4)
     */
    generateId() {
        if (crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * Registra o evento de download
     */
    async trackDownload(candidateData) {
        const payload = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            dataHoraFormatada: new Date().toLocaleString('pt-BR'),
            deputadoFederal: candidateData.deputadoFederal || '',
            deputadoEstadual: candidateData.deputadoEstadual || '',
            senador1: candidateData.senador1 || '',
            senador2: candidateData.senador2 || '',
            governador: candidateData.governador || '',
            presidente: candidateData.presidente || '',
            origem: window.location.hostname || 'local',
            dispositivo: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        };

        // 1. Salva localmente no navegador (LocalStorage)
        this.saveToLocalStorage(payload);

        // 2. Se houver Webhook do Google Apps Script configurado, envia os dados
        if (this.config.metricsWebhookUrl && this.config.metricsWebhookUrl.trim() !== '') {
            try {
                await this.sendToWebhook(this.config.metricsWebhookUrl, payload);
            } catch (err) {
                console.warn('Não foi possível enviar métricas para o webhook remoto:', err);
            }
        }

        return payload;
    }

    /**
     * Envia os dados para a URL do Webhook (Google Sheets Apps Script / Vercel API / Servidor)
     */
    async sendToWebhook(url, data) {
        try {
            // Google Apps Script requer mode: 'no-cors' para requisições cross-origin simples
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log('Métrica enviada com sucesso para o webhook.');
        } catch (error) {
            console.error('Erro ao enviar requisição de métrica:', error);
        }
    }

    /**
     * Salva no LocalStorage do navegador
     */
    saveToLocalStorage(record) {
        try {
            const raw = localStorage.getItem(this.storageKey);
            const list = raw ? JSON.parse(raw) : [];
            list.push(record);
            // Mantém até os últimos 1000 registros locais
            if (list.length > 1000) list.shift();
            localStorage.setItem(this.storageKey, JSON.stringify(list));
        } catch (e) {
            console.error('Erro ao salvar no LocalStorage:', e);
        }
    }

    /**
     * Retorna todas as métricas salvas localmente
     */
    getLocalHistory() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Exporta os dados salvos localmente em formato CSV
     */
    exportLocalToCSV() {
        const history = this.getLocalHistory();
        if (history.length === 0) return null;

        const headers = ['ID', 'Data/Hora', 'Deputado Federal', 'Deputado Estadual', 'Senador 1', 'Senador 2', 'Governador', 'Presidente', 'Dispositivo'];
        const rows = history.map(item => [
            `"${item.id}"`,
            `"${item.dataHoraFormatada || item.timestamp}"`,
            `"${item.deputadoFederal}"`,
            `"${item.deputadoEstadual}"`,
            `"${item.senador1}"`,
            `"${item.senador2}"`,
            `"${item.governador}"`,
            `"${item.presidente}"`,
            `"${item.dispositivo}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        return csvContent;
    }
}
