/**
 * Módulo de Renderização do Canvas para o Santinho Eleitoral
 */
class SantinhoCanvas {
    constructor(canvasElement, config) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.config = config;
        this.templateImg = new Image();
        this.isLoaded = false;
        this.currentData = { ...config.defaults };
        
        // Dimensões originais do template oficial (744 x 1024)
        this.canvas.width = 744;
        this.canvas.height = 1024;
    }

    /**
     * Carrega a imagem base do santinho (usando Base64 para compatibilidade com protocolo file://)
     */
    async init(imageSrc) {
        // Se houver a constante TEMPLATE_IMAGE_BASE64 definida, usa ela para evitar erro de CORS local
        const source = (typeof TEMPLATE_IMAGE_BASE64 !== 'undefined' && TEMPLATE_IMAGE_BASE64) 
            ? TEMPLATE_IMAGE_BASE64 
            : (imageSrc || 'assets/template.jpg');

        return new Promise((resolve, reject) => {
            this.templateImg.crossOrigin = 'anonymous';
            this.templateImg.onload = () => {
                this.isLoaded = true;
                this.render();
                resolve();
            };
            this.templateImg.onerror = (err) => {
                console.error('Erro ao carregar a imagem do template:', err);
                // Fallback para caminho relativo padrão
                if (source !== 'assets/template.jpg') {
                    this.templateImg.src = 'assets/template.jpg';
                } else {
                    reject(err);
                }
            };
            this.templateImg.src = source;
        });
    }

    /**
     * Atualiza os dados dos candidatos e redesenha o santinho
     */
    update(data) {
        this.currentData = { ...this.currentData, ...data };
        if (this.isLoaded) {
            this.render();
        }
    }

    /**
     * Redesenha o canvas completo
     */
    render() {
        if (!this.isLoaded) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // 1. Limpa o canvas e desenha a imagem template de fundo
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(this.templateImg, 0, 0, width, height);

        // 2. Configurações de tipografia
        const fontConfig = this.config.font;
        ctx.fillStyle = fontConfig.color;
        ctx.font = `${fontConfig.weight} ${fontConfig.size} ${fontConfig.family}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 3. Renderiza os dígitos de cada cargo
        this.renderField('deputadoFederal', this.currentData.deputadoFederal);
        
        // Deputado Estadual já vem impresso no template. Se for alterado, redesenha
        if (this.currentData.deputadoEstadual && this.currentData.deputadoEstadual !== '15444') {
            this.renderField('deputadoEstadual', this.currentData.deputadoEstadual, true);
        }

        this.renderField('senador1', this.currentData.senador1);
        this.renderField('senador2', this.currentData.senador2);
        this.renderField('governador', this.currentData.governador);
        this.renderField('presidente', this.currentData.presidente);
    }

    /**
     * Desenha os caracteres de um campo centralizados em cada caixa calibrada
     */
    renderField(fieldName, value, clearBackground = false) {
        const boxes = this.config.boxes[fieldName];
        if (!boxes || !value) return;

        const digits = String(value).trim().split('');
        const ctx = this.ctx;

        boxes.forEach((box, index) => {
            const digit = digits[index];
            
            if (clearBackground) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(box.x, box.y, box.width, box.height);
                ctx.fillStyle = this.config.font.color;
            }

            if (digit !== undefined && digit !== '') {
                const centerX = box.centerX || (box.x + box.width / 2);
                const centerY = (box.centerY || (box.y + box.height / 2)) + 1;

                ctx.fillText(digit, centerX, centerY);
            }
        });
    }

    /**
     * Gera URL para download (JPEG em alta qualidade)
     */
    toDataURL(format = 'image/jpeg', quality = 0.95) {
        return this.canvas.toDataURL(format, quality);
    }

    /**
     * Exporta como Blob para compartilhamento
     */
    toBlob(format = 'image/jpeg', quality = 0.95) {
        return new Promise((resolve) => {
            this.canvas.toBlob(resolve, format, quality);
        });
    }
}
