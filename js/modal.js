const $background = document.getElementById("modal-background");
const $modalContainer = document.getElementById("modal-container");

//basicamente essa variável tem a mesma função da variável data (pegar os dados da api e formar um dicionário)
let currentMovie = {};


function backgroundClickHandler(){
    const $overlay = document.getElementById("modal-overlay");
    $overlay.classList.remove("open");
}

function closeModal(){
    const $overlay = document.getElementById("modal-overlay");
    $overlay.classList.remove("open");
}

//função que inicializa as funções de adicionar filmes no main.js
function addCurrentMovieToList() {
    if(isMovieAlreadyOnList(currentMovie.imdbID)){
        notie.alert({
            type: "error",
            text: "O filme já está presente na lista!"});
        closeModal();
        return;
    }
    addToList(currentMovie);
    updateUi(currentMovie);
    updateLocalStorage();
    closeModal();
}

//criando função para editar o html referente ao modal contido no article
function createModal(data){
    //responsável por receber o valor atual do filme que está no modal
    currentMovie = data;

    $modalContainer.innerHTML = `
    <h2 id="movie-title">${data.Title} - ${data.Year}</h2>
    <section id="modal-body">
        <img id="movie-poster" src=${data.Poster} alt="Poster do Filme.">
        <div id="movie-info">
            <div id="movie-plot">
                <h3>Sinopse: </h3>
                <h4>${data.Plot}</h4>
            </div>
            <div id="movie-actors">
                <h3>Atores: </h3>
                <h4>${data.Actors}</h4>
            </div>
            <div id="movie-genre">
                <h3>Gênero: </h3>
                <h4>${data.Genre}</h4>
            </div>
        </div>
    </section>
    <section id="modal-footer">
        <button id="add-to-list" onclick='{addCurrentMovieToList()}'>Adicionar à Lista</button>
    </section>`;
}
//a função 'onclick' foi adicionada ao html para colocar para inicializar a função que desencadeia o processo de adição de filmes


$background.addEventListener("click", backgroundClickHandler);

