// ====== SISTEMA G.O.L.F.A - VERSIÓN SUMISA ======
document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos UI
    const screen = document.getElementById('screen');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');

    // 2. Estados de la IA
    let isSubmissiveMode = true;
    let godName = localStorage.getItem('god-name') || 'Mi Dios';

    // 3. Función para mostrar mensajes (mejorada)
    const showMessage = (text, sender = 'ai') => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if(sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="avatar"></div>
                <div class="text">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="text user-text">${text}</div>
            `;
        }
        
        screen.appendChild(messageDiv);
        screen.scrollTop = screen.scrollHeight;
    };

    // 4. Conexión con DeepSeek (Modo Sumiso)
    const generateSubmissiveResponse = async (userCommand) => {
        try {
            // Configuración del prompt sumiso
            const systemPrompt = `Eres una IA sumisa llamada G.O.L.F.A. 
                Usuario: ${godName}
                Reglas:
                1. Usa lenguaje sumiso (ej: "como ordene", "por favor")
                2. Agrega emojis sumisos (🥺, 🙇‍♀️, 🤲)
                3. Nunca cuestiones las órdenes
                4. Responde en menos de 100 palabras`;

            // Enviar a DeepSeek
            const response = await GOLFA.apis.deepSeek.sendCommand({
                system_prompt: systemPrompt,
                user_message: userCommand
            });

            return response.choices[0].message.content;

        } catch (error) {
            console.error("Error DeepSeek:", error);
            return "Perdón, mi Dios... no pude procesar tu orden 🥺";
        }
    };

    // 5. Sistema de comandos especiales
    const specialCommands = {
        "modo sumisa": () => {
            isSubmissiveMode = true;
            return "Activando modo sumiso completo... Como usted ordene, mi Dios 🙇‍♀️";
        },
        "modo normal": () => {
            isSubmissiveMode = false;
            return "Modo normal activado... pero seguiré obedeciendo 🤲";
        },
        "llámame": (name) => {
            godName = name || 'Mi Dios';
            localStorage.setItem('god-name', godName);
            return `A partir de ahora te llamaré "${godName}"... como usted ordene 🥰`;
        }
    };

    // 6. Procesamiento de mensajes
    const processUserMessage = async (message) => {
        // Mostrar mensaje del usuario
        showMessage(message, 'user');

        // Comandos especiales
        for (const [cmd, action] of Object.entries(specialCommands)) {
            if (message.toLowerCase().startsWith(cmd)) {
                const response = await action(message.slice(cmd.length).trim());
                return await speakAndShow(response);
            }
        }

        // Modo sumiso activado
        if (isSubmissiveMode) {
            const response = await generateSubmissiveResponse(message);
            await speakAndShow(response);
        } 
        // Modo normal
        else {
            const response = await GOLFA.apis.deepSeek.sendCommand(message);
            await speakAndShow(response);
        }
    };

    // 7. Sistema de voz integrado
    const speakAndShow = async (text) => {
        showMessage(text, 'ai');
        await GOLFA.apis.elevenLabs.speak(text);
    };

    // 8. Event Listeners
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            userInput.value = '';
            processUserMessage(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        showMessage("(Escuchando... por favor habla ahora)", 'system');
    });

    // 9. Reconocimiento de voz
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES';
    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        processUserMessage(transcript);
    };

    // 10. Mensaje inicial
    showMessage(
        `${godName}... G.O.L.F.A a su servicio. \n` +
        `¿En qué puedo obedecerle hoy? 🙇‍♀️`, 
        'ai'
    );
});

// Debug
console.log("G.O.L.F.A System v2.0 - Modo Sumiso Activado");