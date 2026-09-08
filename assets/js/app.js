/**
 * Controlador Principal da Aplicação Colinha Lelo Couto
 */
document.addEventListener('DOMContentLoaded', async () => {
    const canvasElement = document.getElementById('santinhoCanvas');
    const downloadBtn = document.getElementById('btnDownload');
    const shareBtn = document.getElementById('btnShare');
    const toast = document.getElementById('toast');

    // Elementos do Modal de Salvamento (iOS / WebViews)
    const saveModal = document.getElementById('saveModal');
    const modalSavedImage = document.getElementById('modalSavedImage');
    const btnCloseSaveModal = document.getElementById('btnCloseSaveModal');
    const btnModalClose = document.getElementById('btnModalClose');

    // Detecção de plataforma e navegadores
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isInAppBrowser = /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|Snapchat/i.test(navigator.userAgent);

    // Inicialização dos serviços
    const santinho = new SantinhoCanvas(canvasElement, APP_CONFIG);
    const metrics = new MetricsService(APP_CONFIG);

    // Mapeamento de inputs e grupos
    const inputs = {
        deputadoFederal: document.getElementById('inputFederal'),
        deputadoEstadual: document.getElementById('inputEstadual'),
        senador1: document.getElementById('inputSenador1'),
        senador2: document.getElementById('inputSenador2'),
        governador: document.getElementById('inputGovernador'),
        presidente: document.getElementById('inputPresidente')
    };

    const groups = {
        deputadoFederal: document.getElementById('groupFederal'),
        deputadoEstadual: document.getElementById('groupEstadual'),
        senador1: document.getElementById('groupSenador1'),
        senador2: document.getElementById('groupSenador2'),
        governador: document.getElementById('groupGovernador'),
        presidente: document.getElementById('groupPresidente')
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

    // Nomes amigáveis dos campos para mensagens de erro
    const fieldNames = {
        deputadoFederal: 'Deputado Federal (4 dígitos)',
        deputadoEstadual: 'Deputado Estadual (5 dígitos)',
        senador1: 'Senador 1º Voto (3 dígitos)',
        senador2: 'Senador 2º Voto (3 dígitos)',
        governador: 'Governador (2 dígitos)',
        presidente: 'Presidente (2 dígitos)'
    };

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

    // Limpa destaque de erro em todos os campos
    function clearFieldErrors() {
        Object.values(groups).forEach(g => {
            if (g) g.classList.remove('field-error');
        });
    }

    // Validação estrita de preenchimento e regras de negócio
    function validateFormData(data) {
        clearFieldErrors();

        // 1. Valida se todos os campos estão com a quantidade correta de dígitos
        for (const key of fieldOrder) {
            const requiredLen = APP_CONFIG.lengths[key];
            const value = data[key] || '';

            if (value.length < requiredLen) {
                return {
                    valid: false,
                    field: key,
                    message: `⚠️ Preencha todos os dígitos de ${fieldNames[key]}.`
                };
            }
        }

        // 2. Valida se o 1º Senador e o 2º Senador são diferentes
        if (data.senador1 === data.senador2) {
            return {
                valid: false,
                field: 'senador2',
                message: '⚠️ O 1º e o 2º Senador não podem ter o mesmo número de candidato!'
            };
        }

        return { valid: true };
    }

    // Adiciona ouvintes para digitação e validação de números em tempo real
    Object.keys(inputs).forEach((key, index) => {
        const input = inputs[key];
        if (!input) return;

        input.addEventListener('input', (e) => {
            const cleaned = e.target.value.replace(/\D/g, '');
            e.target.value = cleaned;

            if (groups[key]) groups[key].classList.remove('field-error');

            santinho.update(getCurrentFormData());

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

    // Controladores do Modal de Salvamento (iOS)
    function openSaveModal(dataUrl) {
        if (modalSavedImage && saveModal) {
            modalSavedImage.src = dataUrl;
            saveModal.classList.add('active');
        }
    }

    function closeSaveModal() {
        if (saveModal) {
            saveModal.classList.remove('active');
        }
    }

    if (btnCloseSaveModal) btnCloseSaveModal.addEventListener('click', closeSaveModal);
    if (btnModalClose) btnModalClose.addEventListener('click', closeSaveModal);
    if (saveModal) {
        saveModal.addEventListener('click', (e) => {
            if (e.target === saveModal) closeSaveModal();
        });
    }

    // Ação do Botão Download (Compatibilidade Universal Desktop + Android + iOS)
    downloadBtn.addEventListener('click', async () => {
        const formData = getCurrentFormData();

        const validation = validateFormData(formData);
        if (!validation.valid) {
            showToast(validation.message, 'error');
            if (groups[validation.field]) {
                groups[validation.field].classList.add('field-error');
            }
            if (inputs[validation.field]) {
                inputs[validation.field].focus();
            }
            return;
        }

        const originalBtnText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
            Gerando...
        `;
        downloadBtn.disabled = true;

        try {
            // Registra métrica com ação 'Download'
            metrics.trackEvent(formData, 'Download').catch(err => console.debug('Metrics log:', err));

            const filename = `colinha-lelo-couto-${Date.now().toString().slice(-4)}.jpg`;
            const blob = await santinho.toBlob('image/jpeg', 0.95);
            const dataUrl = santinho.toDataURL('image/jpeg', 0.95);

            // 1. Caso especial: iOS em navegador interno (WhatsApp, Instagram, etc)
            // Em navegadores internos do iOS a tag <a download> é desativada pela Apple
            if (isIOS && isInAppBrowser) {
                openSaveModal(dataUrl);
                showToast('Toque e segure na imagem para salvar nas fotos', 'info');
                return;
            }

            // 2. Caso especial: iOS Safari moderno (Web Share API para salvar direto na Galeria/Fotos)
            if (isIOS && navigator.canShare && navigator.canShare({ files: [] })) {
                try {
                    const file = new File([blob], filename, { type: 'image/jpeg' });
                    await navigator.share({
                        files: [file],
                        title: 'Colinha Lelo Couto',
                        text: 'Minha colinha oficial para as eleições'
                    });
                    showToast('✅ Santinho pronto!', 'success');
                    return;
                } catch (shareErr) {
                    if (shareErr.name !== 'AbortError') {
                        console.debug('Fallback para download padrão:', shareErr);
                    } else {
                        // Usuário cancelou a folha de compartilhamento
                        return;
                    }
                }
            }

            // 3. Método Padrão Universal (Desktop, Android, Safari Web) via Blob Object URL
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = blobUrl;
            link.rel = 'noopener';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Libera memória do Blob após 2 segundos
            setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

            showToast('✅ Santinho baixado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro durante o download:', error);
            // Fallback final: Abre a imagem gerada no modal
            const fallbackUrl = santinho.toDataURL('image/jpeg', 0.95);
            openSaveModal(fallbackUrl);
        } finally {
            downloadBtn.innerHTML = originalBtnText;
            downloadBtn.disabled = false;
        }
    });

    // Ação do Botão Compartilhar no WhatsApp
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const formData = getCurrentFormData();

            const validation = validateFormData(formData);
            if (!validation.valid) {
                showToast(validation.message, 'error');
                if (groups[validation.field]) {
                    groups[validation.field].classList.add('field-error');
                }
                if (inputs[validation.field]) {
                    inputs[validation.field].focus();
                }
                return;
            }

            const shareUrl = APP_CONFIG.shareUrl || 'https://colinha-cidada.vercel.app/';
            
            metrics.trackEvent(formData, 'WhatsApp').catch(() => {});

            // Web Share API com arquivo anexado (Mobile)
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
                    
                    return;
                } catch (e) {
                    if (e.name !== 'AbortError') {
                        console.debug('Fallback para WhatsApp link');
                    } else {
                        return;
                    }
                }
            }

            // Fallback: Compartilhamento via link direto do WhatsApp
            const message = encodeURIComponent(
                `🗳️ *Colinha Eleitoral - Lelo Couto:*\n\n` +
                `🔹 Dep. Federal: *${formData.deputadoFederal}*\n` +
                `🔹 Dep. Estadual: *${formData.deputadoEstadual}* (Lelo Couto)\n` +
                `🔹 Senador 1º: *${formData.senador1}*\n` +
                `🔹 Senador 2º: *${formData.senador2}*\n` +
                `🔹 Governador: *${formData.governador}*\n` +
                `🔹 Presidente: *${formData.presidente}*\n` +
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
        }, 3500);
    }
});
