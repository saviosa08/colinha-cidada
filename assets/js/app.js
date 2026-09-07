/**
 * Controlador Principal da Aplicação Colinha Lelo Couto
 */
document.addEventListener('DOMContentLoaded', async () => {
    const canvasElement = document.getElementById('santinhoCanvas');
    const downloadBtn = document.getElementById('btnDownload');
    const shareBtn = document.getElementById('btnShare');
    const toast = document.getElementById('toast');

    // Inicialização dos serviços
    const santinho = new SantinhoCanvas(canvasElement, APP_CONFIG);
    const metrics = new MetricsService(APP_CONFIG);

    // Mapeamento de inputs
    const inputs = {
        deputadoFederal: document.getElementById('inputFederal'),
        deputadoEstadual: document.getElementById('inputEstadual'),
        senador1: document.getElementById('inputSenador1'),
        senador2: document.getElementById('inputSenador2'),
        governador: document.getElementById('inputGovernador'),
        presidente: document.getElementById('inputPresidente')
    };

    // Ordem de campos para auto-tabbing ao digitar
    const fieldOrder = [
        'deputadoFederal',
        'deputadoEstadual',
        'senador1',
        'senador2',
        'governador',
        'presidente'
    ];

    // Preenche valores padrão nos inputs
    Object.keys(inputs).forEach(key => {
        const input = inputs[key];
        if (input && APP_CONFIG.defaults[key] !== undefined) {
            input.value = APP_CONFIG.defaults[key];
        }
    });

    // Carrega imagem e inicializa o canvas
    try {
        await santinho.init('assets/template.jpg');
    } catch (err) {
        showToast('Erro ao carregar o modelo do santinho.', 'error');
    }

    // Função para coletar os valores atuais dos campos
    function getCurrentFormData() {
        const data = {};
        Object.keys(inputs).forEach(key => {
            const input = inputs[key];
            data[key] = input ? input.value.trim() : (APP_CONFIG.defaults[key] || '');
        });
        return data;
    }

    // Adiciona ouvintes para digitação e validação de números
    Object.keys(inputs).forEach((key, index) => {
        const input = inputs[key];
        if (!input) return;

        input.addEventListener('input', (e) => {
            // Permite somente dígitos numéricos
            const cleaned = e.target.value.replace(/\D/g, '');
            e.target.value = cleaned;

            // Atualiza o canvas
            santinho.update(getCurrentFormData());

            // Auto-avanço para o próximo campo editável se preencher
            const maxLength = parseInt(input.getAttribute('maxlength'), 10);
            if (cleaned.length >= maxLength) {
                for (let i = index + 1; i < fieldOrder.length; i++) {
                    const nextKey = fieldOrder[i];
                    const nextInput = inputs[nextKey];
                    if (nextInput && !nextInput.disabled && !nextInput.readOnly) {
                        nextInput.focus();
                        nextInput.select();
                        break;
                    }
                }
            }
        });

        input.addEventListener('focus', () => {
            input.select();
        });
    });

    // Ação do Botão Download
    downloadBtn.addEventListener('click', async () => {
        const formData = getCurrentFormData();

        // Feedback visual sutil no botão
        const originalBtnText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
            Gerando...
        `;
        downloadBtn.disabled = true;

        try {
            // Registra as métricas silenciosamente em segundo plano
            metrics.trackDownload(formData).catch(err => console.debug('Metrics log:', err));

            // Gera a imagem em alta resolução
            const dataUrl = santinho.toDataURL('image/jpeg', 0.95);
            
            // Dispara download
            const link = document.createElement('a');
            link.download = `colinha-lelo-couto-${Date.now().toString().slice(-4)}.jpg`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('✅ Santinho baixado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro durante o download:', error);
            showToast('Erro ao gerar a imagem para download.', 'error');
        } finally {
            downloadBtn.innerHTML = originalBtnText;
            downloadBtn.disabled = false;
        }
    });

    // Ação do Botão Compartilhar no WhatsApp
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const formData = getCurrentFormData();
            const shareUrl = APP_CONFIG.shareUrl || 'https://colinha-cidada.vercel.app/';
            
            // Tenta usar Web Share API se suportar arquivos no celular
            if (navigator.canShare && navigator.canShare({ files: [] })) {
                try {
                    const blob = await santinho.toBlob('image/jpeg', 0.95);
                    const file = new File([blob], 'colinha-lelo-couto.jpg', { type: 'image/jpeg' });
                    
                    await navigator.share({
                        title: 'Colinha Lelo Couto',
                        text: `🗳️ Confira minha colinha eleitoral com Lelo Couto 15.444!\n\n👉 Monte a sua também no link: ${shareUrl}`,
                        url: shareUrl,
                        files: [file]
                    });
                    
                    metrics.trackDownload(formData).catch(() => {});
                    return;
                } catch (e) {
                    if (e.name !== 'AbortError') {
                        console.debug('Fallback para WhatsApp link');
                    }
                }
            }

            // Fallback: Compartilhamento via link direto do WhatsApp
            metrics.trackDownload(formData).catch(() => {});
            
            const message = encodeURIComponent(
                `🗳️ *Colinha Eleitoral - Lelo Couto:*\n\n` +
                `🔹 Dep. Federal: *${formData.deputadoFederal || '4444'}*\n` +
                `🔹 Dep. Estadual: *${formData.deputadoEstadual || '15444'}* (Lelo Couto)\n` +
                `🔹 Senador 1º: *${formData.senador1 || '400'}*\n` +
                (formData.senador2 ? `🔹 Senador 2º: *${formData.senador2}*\n` : '') +
                `🔹 Governador: *${formData.governador || '15'}*\n` +
                (formData.presidente ? `🔹 Presidente: *${formData.presidente}*\n` : '') +
                `\n👉 *Monte a sua colinha personalizada também no link:*\n${shareUrl}`
            );
            
            window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
        });
    }

    // Exibição de Toast de notificação
    function showToast(message, type = 'info') {
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
});
