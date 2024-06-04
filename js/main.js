const $searchButton = document.getElementById("search-button");
const $movieName =  document.getElementById("movie-name");
const $movieYear = document.getElementById("movie-year");
const $movieListContainer = document.getElementById("movie-list");

//let $movieList = []

//inicializa a página com o valor presente no armazenamento local da página
let $movieList = JSON.parse(localStorage.getItem("movieList")) ?? [];

//função para tratar o botão de busca
async function searchButtonClickHandler(){
    try {
        //cadastro na página omdbapi para receber a chave de api e atribuir a constante key
        const url = `http://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("data: ", data);
        //tratamento de erro para o caso de não encontrar o filme
        if(data.Error){
            throw new Error("Filme não encontrado");
        }
        createModal(data);
        const $overlay = document.getElementById("modal-overlay");
        $overlay.classList.add("open");   
    //exibe o erro caso as informções não estejam de acordo
    } catch (error) {
        notie.alert({
            type: "error",
            text: error.message});
    }
}

//função para tratar o parâmentro relacionado ao nome do filme
function movieNameParameterGenerator(){
    if($movieName.value === ""){
        throw new Error("O nome do filme deve ser informado!");
    }
    else{
        return $movieName.value.split(" ").join("+");
    }
}

//função para tratar o parâmetro relacionado ao ano do filme
function movieYearParameterGenerator(){
    if($movieYear.value === ""){
        return "";
    }
    if($movieYear.value.length !== 4 || Number.isNaN(Number($movieYear.value))){
        throw new Error("Ano do filme inválido!")
    }
    else{
        return `&y=${$movieYear.value}`;
    }
}

//função para adicionar os filmes na lista de filmes
function addToList(movieObject){
    $movieList.push(movieObject);
}

//função para saber se o filme está na lista ou não, para evitar mais de uma adição
function isMovieAlreadyOnList(id){

    //função aninhada para realizar comparação e saber se o id que está sendo adicionado se faz presente na lista de filmes
    function doesThisIdBelongToThisMovie(movieObject){
        return movieObject.imdbID === id;
    }
    return Boolean($movieList.find(doesThisIdBelongToThisMovie));
}

//gera os diferentes cards na lista
function updateUi(movieObject){
    $movieListContainer.innerHTML += `
    <article id="movie-card${movieObject.imdbID}">
        <img src="${movieObject.Poster}" alt="Poster de ${movieObject.Title}">
        <button class="remove-button" onclick="{removeFilmFromList('${movieObject.imdbID}')}"><i class="bi bi-trash"></i> Remover</button>
    </article>`;
}

//função para confirmar remoção do filme
function removeFilmFromList(id){
    notie.confirm({
        text: "Deseja mesmo remover o filme da sua lista?",
        submitText: "Sim",
        cancelText: "Não",
        position: "top",
        //função para de fato remover o filme
        submitCallback: function removeMovie(){
            $movieList = $movieList.filter((movie) => movie.imdbID !==id);
            document.getElementById(`movie-card${id}`).remove();
            updateLocalStorage();
        },
    });
}

 //função para armazenar a lista de filmes localmente
function updateLocalStorage(){
    localStorage.setItem('movieList', JSON.stringify($movieList));
}

for(const movieInfo of $movieList){
    updateUi(movieInfo);
}


//ato de clicar na busca para iniciar os processos
$searchButton.addEventListener("click", searchButtonClickHandler);