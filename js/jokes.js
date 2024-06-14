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
    //console.log(term)

    const results = []
    
    if (term == 'dark') {
        for (let i = 0; i < 5; i++) {
            try {
                const response = await fetch('https://v2.jokeapi.dev/joke/Dark');
                const jokeData = await response.json();
                const joke = jokeData.setup + ' ' + jokeData.delivery;

                if (jokeData.setup == undefined || jokeData.delivery == undefined) {
                    const response = await fetch('https://v2.jokeapi.dev/joke/Dark');
                    const jokeData = await response.json();
                    const joke = jokeData.setup + ' ' + jokeData.delivery;

                    if (jokeData.setup != undefined || jokeData.delivery != undefined) {
                        results.push({ joke: joke });
                    }
                    else {
                        console.log('erro ao buscar a piada')
                    }
                }
                else {
                    results.push({ joke: joke });
                }
                
                // console.log('results', results);
            }
            catch (error) {
                console.error('Erro ao buscar a piada:', error);
                return [];
            }
        }
    }
    else {
        for (let i = 0; i < 10; i++) {
            try {
                const response = await fetch(`https://v2.jokeapi.dev/joke/Any?contains=${term}`);
                const jokeData = await response.json();
                const joke = jokeData.setup + ' ' + jokeData.delivery;

                if(jokeData.setup == undefined || jokeData.delivery == undefined) {
                    const response = await fetch(`https://v2.jokeapi.dev/joke/Any?contains=${term}`);
                    const jokeData = await response.json();
                    const joke = jokeData.setup + ' ' + jokeData.delivery;

                    if (jokeData.setup != undefined || jokeData.delivery != undefined) {
                        results.push({ joke: joke });
                    }
                    else {
                        console.log('erro ao buscar a piada')
                    }

                } else {
                    results.push({ joke: joke });
                }

            }
            catch (error) {
                console.error('Erro ao buscar a piada:', error);
                return [];
            }
        }
    }

    console.log('joke', results)
    return results || [];   
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
    console.log('dadJokes', dadJokes);

    const otherJokes = await searchJoke(category);
    console.log('otherJokes', otherJokes);

    const jokesList = [...dadJokes, ...otherJokes];

    console.log('jokesList', jokesList);
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
