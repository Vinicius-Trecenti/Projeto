async function searchDadJokes(term) {
    const apiUrl = `https://icanhazdadjoke.com/search?term=${term}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch jokes');
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching dad jokes:', error);
        return [];
    }
}

async function searchJoke(term) {
    try {
        const response = await fetch(`https://v2.jokeapi.dev/joke/Any?contains=${term}`);
        const jokeData = await response.json();
        return jokeData.jokes || [];
    }
    catch (error) {
        console.error('Erro ao buscar a piada:', error);
        return [];
    }
}

function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
}

async function loadJokes() {
    const category = getCategoryFromURL();
    if (!category) {
        console.error('No category specified in URL');
        return;
    }

    const loadingElement = document.getElementById('loading');
    const jokesContainer = document.getElementById('jokes-list');

    loadingElement.style.display = 'block';
    jokesContainer.innerHTML = '';

    const dadJokes = await searchDadJokes(category);
    const otherJokes = await searchJoke(category);
    const jokesList = [...dadJokes, ...otherJokes];

    loadingElement.style.display = 'none';

    if (jokesList.length === 0) {
        jokesContainer.innerHTML = '<p>No jokes found for this category.</p>';
    } else {
        jokesList.forEach(joke => {
            const jokeElement = document.createElement('div');
            jokeElement.className = 'joke';
            jokeElement.innerHTML = `
                <p>${joke.joke || joke.setup + ' ' + joke.delivery}</p>
            `;
            jokesContainer.appendChild(jokeElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', loadJokes);
