/**
 * Módulo de Métricas e Registro de Estatísticas de Download e Compartilhamento
 */
class MetricsService {
    constructor(config) {
        this.config = config;
        this.storageKey = 'colinha_cidada_metrics_v1';
    }

    /**
     * Gera um ID único para o evento (UUIDv4)
     */
    generateId() {
        if (crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    }

    /**
     * Registra o evento de ação (Download ou WhatsApp)
     */
    async trackEvent(candidateData, actionType = 'Download') {
        const payload = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            dataHoraFormatada: new Date().toLocaleString('pt-BR'),
            acao: actionType, // 'Download' ou 'WhatsApp'
            deputadoFederal: candidateData.deputadoFederal || '',
            deputadoEstadual: candidateData.deputadoEstadual || '',
            senador1: candidateData.senador1 || '',
            senador2: candidateData.senador2 || '',
            governador: candidateData.governador || '',
            presidente: candidateData.presidente || '',
            origem: window.location.hostname || 'local',
            dispositivo: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        };

        // 1. Salva localmente
        this.saveToLocalStorage(payload);

        // 2. Envia para o Webhook do Google Apps Script
        if (this.config.metricsWebhookUrl && this.config.metricsWebhookUrl.trim() !== '') {
            try {
                await this.sendToWebhook(this.config.metricsWebhookUrl, payload);
            } catch (err) {
                console.debug('Métricas remoto:', err);
            }
        }

        return payload;
    }

    /**
     * Alias retrocompatível
     */
    async trackDownload(candidateData, actionType = 'Download') {
        return this.trackEvent(candidateData, actionType);
    }

    /**
     * Envia os dados para a URL do Webhook
     */
    async sendToWebhook(url, data) {
        try {
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log(`Métrica [${data.acao}] enviada com sucesso para o webhook.`);
        } catch (error) {
            console.debug('Erro ao enviar métrica:', error);
        }
    }

    /**
     * Salva no LocalStorage
     */
    saveToLocalStorage(record) {
        try {
            const raw = localStorage.getItem(this.storageKey);
            const list = raw ? JSON.parse(raw) : [];
            list.push(record);
            if (list.length > 1000) list.shift();
            localStorage.setItem(this.storageKey, JSON.stringify(list));
        } catch (e) {
            console.debug('LocalStorage error:', e);
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
}
