// -------------------------------------- CRUD FAVORITES ---------------------------------------------------------
function add(event) {
    const click = event.target;
    let card = click.closest('.card');

    var topContent = card.querySelector('.top h3').textContent;
    var paragraphs = card.querySelectorAll('.text p');

    var firstParagraph = paragraphs[0].textContent;
    var secondParagraph = paragraphs[1].textContent;

    createCard(topContent.split(':')[1], firstParagraph, secondParagraph);
    card.remove();

}

function createCard(category, paragraph1, paragraph2) {
    const cards = document.querySelector('#cards')

    cards.innerHTML += `
                        <div class="card">
                            <div class="top">
                                <h3>Category: ${category}</h3>
                            </div>

                            <div class="text">
                                <p>${paragraph1}</p>
                                <p>${paragraph2}</p> 
                            </div>

                            <div>
                                <button onclick="openModal(event)">Edit</button>
                                <button onclick="deleteFavorite(event)">Delete</button>
                            </div>
                        </div>
                        `
}

function deleteFavorite(event) {
    const click = event.target;
    const card = click.closest('.card');
    card.remove()
    console.log("deletaar")
}

function openModal(event) {
    event.preventDefault();

    var card = event.target.closest('.card');
    var topContent = card.querySelector('.top h3').textContent;
    var categoryText = topContent.split(':')[1].trim();
    var paragraphs = card.querySelectorAll('.text p');
    var firstParagraph = paragraphs.length > 0 ? paragraphs[0].textContent : '';
    var secondParagraph = paragraphs.length > 1 ? paragraphs[1].textContent : '';

    // Preenche o modal com o conteúdo do card
    document.getElementById('category').value = categoryText;
    document.getElementById('firstParagraph').value = firstParagraph;
    document.getElementById('secondParagraph').value = secondParagraph;

    // Exibe o modal
    var modal = document.getElementById('editModal');
    modal.style.display = "block";

    // Fecha o modal quando o botão de fechar é clicado
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Fecha o modal quando o usuário clica fora do modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Salva as mudanças quando o formulário é enviado
    var form = document.getElementById('editForm');
    form.onsubmit = function (event) {
        event.preventDefault();

        // Atualiza o card com os novos valores
        card.querySelector('.top h3').textContent = "Category: " + document.getElementById('category').value;
        paragraphs[0].textContent = document.getElementById('firstParagraph').value;
        if (paragraphs.length > 1) {
            paragraphs[1].textContent = document.getElementById('secondParagraph').value;
        } else {
            var newParagraph = document.createElement('p');
            newParagraph.textContent = document.getElementById('secondParagraph').value;
            card.querySelector('.text').appendChild(newParagraph);
        }

        // Fecha o modal
        modal.style.display = "none";
    }
}

// ---------------------------------------- API -------------------------------------------------------------------------

async function fetchJoke() {
    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky,Christmas');
        const jokeData = await response.json();

        // console.log('jokeData', jokeData);
        return jokeData
    }
    catch (error) {
        console.error('Erro ao buscar a piada:', error);
    }
}

async function getDadJokes() {
    try {
        const response = await fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json' //pra esse site retornar minha respostinha no formato json
            }
        });
        const jokeData = await response.json();
        
        // console.log('jokeData', jokeData);
        return jokeData;
    }
    catch (error) {
        console.error('Erro ao buscar a piada:', error);
    }
}

async function loadJokes() {
    try {
        const jokesArray = [];
        for(let i = 0; i <= 1; i++) {
            const joke1 = await fetchJoke();
            const joke2 = await getDadJokes();

            // console.log('Jokes:', joke1, 'and', joke2);

            if (joke1 != null) {
                jokesArray.push(joke1);
            }

            // console.log('jokesss', joke2.joke)
            if (joke2 != null) {
                const jokeParts = joke2.joke.split(/[.?]/);

                joke2.setup =jokeParts[0].trim();
                joke2.delivery =jokeParts[1] ? jokeParts[1].trim() : ''; 
                jokesArray.push(joke2);
            }

            jokesArray.forEach(joke => {
                // Verifica se setup e delivery não são undefined antes de inserir
                if (joke.setup !== undefined && joke.delivery !== undefined && joke.category !== undefined) {
                    insertJokes(joke.category, joke.setup, joke.delivery);
                }
            });
        }
        
    } catch (error) {
        console.error('Erro ao carregar as piadas:', error);
    }
}

function insertJokes(category, paragraph1, paragraph2) {
    const cards = document.querySelector('.caixa .container .esquerda .cards')
    cards.innerHTML += `
                            <div class="card">
                                <div class="top">
                                    <h3>Category: ${category}</h3>
                                </div>
                                <div class="text">
                                    <p>${paragraph1}</p>
                                    <p>${paragraph2}</p> 
                                </div>
                                <button onclick="add(event)">Adicionar</button>
                            </div>
                        `
}

// -------------------- SEARCH --------------------
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
        return data;
    } catch (error) {
        console.error('Error searching dad jokes:', error);
        return null;
    }
}

async function searchJoke(term) {
    try {
        const response = await fetch(`https://v2.jokeapi.dev/joke/Any?contains=${term}`);
        const jokeData = await response.json();
        return jokeData
    }
    catch (error) {
        console.error('Erro ao buscar a piada:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    let typingTimer; // Variável para armazenar o temporizador

    searchInput.addEventListener('input', function() {
        clearTimeout(typingTimer); 
    
        typingTimer = setTimeout(async function() {
            const searchText = searchInput.value; // Obter o texto digitado
            // console.log('Texto digitado:', searchText);
            
            try {
    const dadJokesResult = await searchDadJokes(searchText);
                const jokeResult = await searchJoke(searchText);
    
                // console.log('Dad jokes:', dadJokesResult);
                // console.log('Joke:', jokeResult);
                addsearchJokes(dadJokesResult, jokeResult);
            } catch (error) {
                console.error('Error:', error);
            }

        }, 500)
    })
})

function addsearchJokes(dadJokesResult, jokeResult) {
    const cards = document.querySelector('.caixa .container .esquerda .cards')
    cards.innerHTML = ''
    console.log('jokesss', jokeResult, dadJokesResult)
    insertJokes(jokeResult.category, jokeResult.setup, jokeResult.delivery);
    
    // console.log('jokesss', dadJokesResult.results[0].joke)
    for (const result of dadJokesResult.results) {
        console.log(result.joke);
        const jokeParts = result.joke.split(/[.?]/);
        jokeParts[2] = 'Search' ;

        console.log(jokeParts);
        if(result.category == 'undefined'){
            result.category = 'Search'
        }
        insertJokes(jokeParts[2], jokeParts[0].trim(), jokeParts[1] ? jokeParts[1].trim() : '');
    }
}
