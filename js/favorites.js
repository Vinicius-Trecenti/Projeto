function add(event){
    const click = event.target;
    let card = click.closest('.card');

    var topContent = card.querySelector('.top h3').textContent;
    var paragraphs = card.querySelectorAll('.text p');

    var firstParagraph = paragraphs[0].textContent;
    var secondParagraph = paragraphs[1].textContent;

    createCard(topContent.split(':')[1], firstParagraph, secondParagraph);
}

function createCard(category, paragraph1, paragraph2){
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

function deleteFavorite(event){
    const click = event.target;
    const card = click.closest('.card');
    card.remove()
    console.log("deletaar")
}

function openModal(event) {
    event.preventDefault();
    
    // Seleciona o card
    var card = event.target.closest('.card');
    
    // Acessa o conteúdo do card
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
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Fecha o modal quando o usuário clica fora do modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Salva as mudanças quando o formulário é enviado
    var form = document.getElementById('editForm');
    form.onsubmit = function(event) {
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
