const circles = document.querySelectorAll(".circle");
const input = document.querySelector('input[type="text"]');
const button = document.querySelector('button[type="submit"]');

const nome = String(prompt('Qual Seu nome'))

function checkSelectedElements() {
  const categorias = document.querySelectorAll(".shirts");
  let todasSelecionadas = true;
  categorias.forEach((categoria) => {
    const elementosSelecionados = categoria.querySelectorAll(".circle.selecionado");
    if (elementosSelecionados.length === 0) {
      todasSelecionadas = false;
    }
  });
  if (todasSelecionadas) {
    button.classList.add("selecionado");
  } else {
    button.classList.remove("selecionado");
    
  }
}

circles.forEach((circle) => {
  circle.addEventListener("click", () => {
    
    const categoria = circle.closest(".shirts").getAttribute("data-categoria");
    const outrosCirculos = document.querySelectorAll(`.shirts[data-categoria="${categoria}"] .circle.selecionado`);
    outrosCirculos.forEach((circulo) => {
      circulo.classList.remove("selecionado");
    });

    circle.classList.add("selecionado");
    checkSelectedElements()
  });
});


function getElement() {
  const idsElementosSelecionados = [];
  const categorias = document.querySelectorAll(".shirts");
  categorias.forEach((categoria) => {
    const elementosSelecionados = categoria.querySelectorAll(".circle.selecionado");
    elementosSelecionados.forEach((elemento) => {
      const idElementoSelecionado = elemento.closest(".shirt").getAttribute("id");
      idsElementosSelecionados.push(idElementoSelecionado);
    });
  });
  return idsElementosSelecionados
}

function ecomendar(list,link,nome) {
  axios.post('https://mock-api.driven.com.br/api/v4/shirts-api/shirts', {
  model: list[0],
  neck: list[1],
  material: list[2],
  image: link,
  owner: nome,
  author: nome
})
.then(function (response) {
  console.log('Objeto criado:', response.data);
})
.catch(function (error) {
  console.log('Erro:', error.response.data);
});
}


input.addEventListener('input', () => {
  if (input.value) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
});


const form = document.getElementById('my-form');
form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  const input = document.querySelector('input[type="text"]');
  const link = input.value;
  console.log(link); 
  ecomendar(getElement(),link,nome)
});
