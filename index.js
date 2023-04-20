const circles = document.querySelectorAll(".circle");
const input = document.querySelector('input[type="text"]');
const button = document.querySelector('button[type="submit"]');

const cardsContainer = document.getElementById('cards-container')

const modalcontent = document.getElementById('modal-content')
const modal = document.getElementById("modal-encomenda");



// const nome = String(prompt('Qual Seu nome'))
const nome = 'João'

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
  console.log('from getElement', idsElementosSelecionados)
  return [idsElementosSelecionados[0],idsElementosSelecionados[1],idsElementosSelecionados[2]];
}

function ecomendar(model,neck,material,link,nome) {
  console.log('from ecomendar', model,neck,material,link,nome)
  axios.post('https://mock-api.driven.com.br/api/v4/shirts-api/shirts', {
  model: model,
  neck: neck,
  material: material,
  image: link,
  owner: nome,
  author: nome
})
.then(function (response) {
  console.log('A encomenda Foi confirmada. :', response.data);
  alert('A encomenda Foi confirmada.');
})
.catch(function (error) {
  console.log('Ops, não conseguimos processar sua encomenda:', error.response.data);
  alert('Ops, não conseguimos processar sua encomenda')
});
}

function addToUi(id,image,autor){
  const newElement = document.createElement('div');
  newElement.classList.add('card');
  newElement.innerHTML += `
  <img src="${image}"/>
  <p><span>Criador:</span> ${autor}</p>
  <h1 style="display: none;">${id}</h1>`
 
  cardsContainer.appendChild(newElement);

  newElement.addEventListener("click", () => {
    const id = newElement.querySelector("h1").textContent;
    if (confirm()){
      getOrder(Number(id))
    }
  });
}

function getOrder(ID_TO_FILTER) {
  axios.get("https://mock-api.driven.com.br/api/v4/shirts-api/shirts")
  .then(response => {
    const filteredShirt = response.data.find(shirt => shirt.id === ID_TO_FILTER);
    console.log(filteredShirt);
    CreateModal(filteredShirt.image,filteredShirt.model,filteredShirt.neck,filteredShirt.material,nome)
  })
  .catch(error => {
    console.log(error);
  });
}

function loadImages() {
  axios.get('https://mock-api.driven.com.br/api/v4/shirts-api/shirts')
  .then(response => {
    response.data.forEach(shirt => {
      // console.log(shirt.id, shirt.model, shirt.neck, shirt.material, shirt.image, shirt.owner);
      addToUi(shirt.id,shirt.image,shirt.owner)
    });
  })
  .catch(error => {
    console.log(error);
  });
}


input.addEventListener('input', () => {
  if (input.value) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
});

loadImages()
const form = document.getElementById('my-form');
form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  const input = document.querySelector('input[type="text"]');
  const link = input.value;
  console.log(link); 
  ecomendar(getElement()[0],getElement()[1],getElement()[2],link,nome)
});


function CreateModal(img, model, neck, material,nome) {
  modal.style.display = "block"; // Show the modal
  modalcontent.innerHTML = `
    <h1>Image:</h1>
    <div class="imagem">
      <img src="${img}" />
    </div>
    <div class="informacoes">
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Modelo:</strong> ${model}</p>
      <p><strong>Estilo da Gola:</strong> ${neck}</p>
      <p><strong>Material:</strong> ${material}</p>
      <form>
        <button type="submit" class="add-to-cart">Confirm</button>
        <button type="button" class="cancel">Cancel</button>
      </form>
    `;

  const modalForm = modalcontent.querySelector("form");
  const addToCartButton = modalForm.querySelector(".add-to-cart");
  const cancelButton = modalForm.querySelector(".cancel");

  // Add event listener to Add to Cart button
  addToCartButton.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("Item Confirmed");
    ecomendar(model,neck,material,img,nome)

    modal.style.display = "none";
  });

  // Add event listener to Cancel button
  cancelButton.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("Modal closed");
    modal.style.display = "none";
  });
}



