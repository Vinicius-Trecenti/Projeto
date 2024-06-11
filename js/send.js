// -------------------------------------- CRUD SEND ---------------------------------------------------------

let card_id = 0;
function createSend(categoria, piada, nome, sobrenome, email) {
    const cards = document.querySelector('.cards')
    let currentDate = new Date();
    currentDate = currentDate.getDate().toString() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();

    card_id++
    cards.innerHTML +=
        `
                        <div class="card" id="${card_id}">
                            <div class="top">
                                <h3>Category: ${categoria}</h3>
                            </div>

                            <div class="text">
                                <p>${piada}</p>
                            </div>

                            <div class="footer-card">
                                <p>Send by: ${nome}  ${sobrenome}</p>
                                <p>Email: ${email}</p>
                                <p>Date: ${currentDate}</p>
                            </div>
                            <div>
                                <button onclick="openEditModal(event)">Edit</button>
                                <button onclick="deleteSend(event)">Delete</button>
                            </div>
                        </div>
                        `
}



function getForm() {
    console.log('pegou')
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const email = document.getElementById('email').value;
        const categoria = document.getElementById('categoria').value;
        const piada = document.getElementById('piada').value;
        form.reset();

        createSend(categoria, piada, nome, sobrenome, email);
    });
}

function deleteSend(event) {
    const click = event.target;
    const card = click.closest('.card');
    card.remove()
    console.log("deletaar")
}

function openEditModal(event) {
    const click = event.target;
    const card = click.closest('.card');
    const categoria = card.querySelector('h3').textContent.replace('Category: ', '').trim();
    const piada = card.querySelector('.text p').textContent;
    const nomeSobrenome = card.querySelector('.footer-card p:nth-child(1)').textContent.replace('Send by: ', '').trim().split(' ');
    const nome = nomeSobrenome[0];
    const sobrenome = nomeSobrenome[1];
    const email = card.querySelector('.footer-card p:nth-child(2)').textContent.replace('Email: ', '').trim();

    document.getElementById('edit-categoria').value = categoria;
    document.getElementById('edit-piada').value = piada;
    document.getElementById('edit-nome').value = nome;
    document.getElementById('edit-sobrenome').value = sobrenome;
    document.getElementById('edit-email').value = email;

    document.getElementById('edit-modal').style.display = 'block';
    document.getElementById('edit-card-id').value = card.id;
}

function saveChanges() {
    const cardId = document.getElementById('edit-card-id').value;
    const card = document.getElementById(cardId);

    const categoria = document.getElementById('edit-categoria').value;
    const piada = document.getElementById('edit-piada').value;
    const nome = document.getElementById('edit-nome').value;
    const sobrenome = document.getElementById('edit-sobrenome').value;
    const email = document.getElementById('edit-email').value;

    card.querySelector('h3').textContent = `Category: ${categoria}`;
    card.querySelector('.text p').textContent = piada;
    card.querySelector('.footer-card p:nth-child(1)').textContent = `Send by: ${nome} ${sobrenome}`;
    card.querySelector('.footer-card p:nth-child(2)').textContent = `Email: ${email}`;

    cancelEdit();
}


function cancelEdit() {
    document.getElementById('edit-modal').style.display = 'none';
}