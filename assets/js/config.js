/**
 * Configurações da Aplicação Colinha Lelo Couto
 */
const APP_CONFIG = {
    // Título da aplicação
    appName: 'Colinha Lelo Couto',

    // Valores padrão dos candidatos
    defaults: {
        deputadoFederal: '4444',
        deputadoEstadual: '15444',
        senador1: '400',
        senador2: '',
        governador: '15',
        presidente: ''
    },

    // URL do Webhook do Google Apps Script para salvar métricas em segundo plano
    // Cole aqui a URL do seu Web App gerada no Google Apps Script (veja README.md)
    metricsWebhookUrl: 'https://script.google.com/macros/s/AKfycbxF7FkkPfHfmHZos-ADQSRiTPmxH66TuZDxiI-5C-yo8RVs3bIODhxv-bj_a7FeiYBFLA/exec',

    // Coordenadas exatas das caixas de dígitos no template oficial (744 x 1024)
    // Calibradas pixel a pixel diretamente na imagem original
    boxes: {
        deputadoFederal: [
            { x: 44,  y: 192, width: 60, height: 61, centerX: 74,  centerY: 222 },
            { x: 111, y: 192, width: 60, height: 61, centerX: 141, centerY: 222 },
            { x: 178, y: 192, width: 60, height: 61, centerX: 208, centerY: 222 },
            { x: 245, y: 192, width: 60, height: 61, centerX: 275, centerY: 222 }
        ],
        deputadoEstadual: [
            { x: 44,  y: 301, width: 60, height: 61, centerX: 74,  centerY: 331 },
            { x: 111, y: 301, width: 60, height: 61, centerX: 141, centerY: 331 },
            { x: 178, y: 301, width: 60, height: 61, centerX: 208, centerY: 331 },
            { x: 245, y: 301, width: 60, height: 61, centerX: 275, centerY: 331 },
            { x: 312, y: 301, width: 60, height: 61, centerX: 342, centerY: 331 }
        ],
        senador1: [
            { x: 44,  y: 419, width: 60, height: 61, centerX: 74,  centerY: 450 },
            { x: 111, y: 419, width: 60, height: 61, centerX: 141, centerY: 450 },
            { x: 178, y: 419, width: 60, height: 61, centerX: 208, centerY: 450 }
        ],
        senador2: [
            { x: 44,  y: 534, width: 60, height: 61, centerX: 74,  centerY: 564 },
            { x: 111, y: 534, width: 60, height: 61, centerX: 141, centerY: 564 },
            { x: 178, y: 534, width: 60, height: 61, centerX: 208, centerY: 564 }
        ],
        governador: [
            { x: 44,  y: 642, width: 60, height: 61, centerX: 74,  centerY: 672 },
            { x: 111, y: 642, width: 60, height: 61, centerX: 141, centerY: 672 }
        ],
        presidente: [
            { x: 44,  y: 748, width: 60, height: 61, centerX: 74,  centerY: 778 },
            { x: 111, y: 748, width: 60, height: 61, centerX: 141, centerY: 778 }
        ]
    },

    // Estilo da tipografia dos dígitos desenhados no canvas
    font: {
        family: "'Montserrat', 'Arial Black', Impact, sans-serif",
        weight: '900',
        size: '50px',
        color: '#1b3f94' // Azul oficial idêntico ao "15444" impresso
    }
};
