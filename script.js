const API_KEY = '7bad93898118cff23e4f06e0c3553273';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// 1. Função que busca os dados
const getWeatherData = async (city) => {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`);
        const data = await response.json();
        
        console.log("Dados recebidos:", data); 

        if (!response.ok) throw new Error('Cidade não encontrada');
        
        return data; // ESSENCIAL: Retornar os dados para quem chamou
        
    } catch (error) {
        alert("Erro: " + error.message);
        return null;
    }
};

// 2. Lógica da Sugestão Inteligente
const getSmartInsight = (temp, weatherMain, humidity) => {
    if (weatherMain.toLowerCase().includes('rain')) {
        return { text: "Leve um guarda-chuva! Pipoca e filme caem bem hoje.", icon: "umbrella" };
    }
    if (temp > 30) {
        return { text: "Muito calor! Hidrate-se e procure uma sombra.", icon: "thermometer-sun" };
    }
    if (temp > 18 && temp <= 28 && humidity < 70) {
        return { text: "Clima perfeito para uma caminhada ou café!", icon: "bike" };
    }
    return { text: "Dia tranquilo. Ótimo para focar nos estudos!", icon: "code" };
};

// 3. Função que atualiza a Interface (DOM)
const updateUI = (data) => {
    if (!data) return;

    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temp-value').innerText = Math.round(data.main.temp);
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `${Math.round(data.wind.speed * 3.6)} km/h`;

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('date').innerText = new Date().toLocaleDateString('pt-BR', options);

    const insight = getSmartInsight(data.main.temp, data.weather[0].main, data.main.humidity);
    document.getElementById('suggestion').innerText = insight.text;
    
    const insightIcon = document.querySelector('.insight-box i');
    insightIcon.setAttribute('data-lucide', insight.icon);

    lucide.createIcons();
};

// 4. Seleção de Elementos e Eventos
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

const handleSearch = async () => {
    const city = cityInput.value.trim(); 
    
    if (!city) {
        alert("Por favor, digite o nome de uma cidade.");
        return;
    }

    console.log("Iniciando busca para:", city);
    const data = await getWeatherData(city);
    
    if (data) {
        updateUI(data);
        cityInput.value = ""; 
    }
};

searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});