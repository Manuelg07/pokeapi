const pokedex = document.getElementById('pokedex');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const previousBtn = document.getElementById('previous-btn');
const nextBtn = document.getElementById('next-btn');
// Variable para almacenar todos los Pokémon recuperados.
let allPokemon = [];

// Función para recuperar los Pokemon.
async function fetchPokemon() {
  // Endpoint correcto de la API.
  const url = 'https://pokeapi.co/api/v2/pokemon?limit=150';
  const response = await fetch(url);
  const data = await response.json();
  // Mapear la información de los Pokemon a un formato más simple.
  allPokemon = data.results.map((pokemon) => ({
    name: pokemon.name,
    url: pokemon.url,
  }));
  // Llamar a la función para recuperar información adicional de cada Pokemon.
  fetchPokemonDetails();
}

// Función para recuperar información adicional de cada Pokemon.
async function fetchPokemonDetails() {
  for (const pokemon of allPokemon) {
    const response = await fetch(pokemon.url);
    const data = await response.json();
    // Actualizar la información del Pokemon con la información adicional recuperada.
    pokemon.image = data.sprites.front_default;
    pokemon.type = data.types.map((type) => type.type.name).join(', ');
    pokemon.id = data.id;
  }
  // Pintar todos los Pokemon en la página.
  displayPokemon(allPokemon, 1);
}

// Función para pintar la información en la página.
function displayPokemon(pokemonList, page) {
  const pageSize = 20; // Declarar la constante antes de utilizarla.
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedPokemon = pokemonList.slice(startIndex, endIndex);
  const pokemonCards = displayedPokemon.map((pokemon) => {
    return `
      <div class="card">
        <div class="image-container">
          <img src="${pokemon.image}" alt="${pokemon.name}" />
        </div>
        <div class="info">
          <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>
          <h3 class="name">${pokemon.name}</h3>
          <small class="type">Type: ${pokemon.type}</small>
        </div>
      </div>
    `;
  });
  pokedex.innerHTML = pokemonCards.join('');

// Deshabilitar el botón de anterior si estamos en la primera página.
if (currentPage === 1) {
    previousBtn.disabled = true;
  } else {
    previousBtn.disabled = false;
  }

  // Deshabilitar el botón de siguiente si estamos en la última página.
  if (currentPage === Math.ceil(allPokemon.length / pageSize)) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}
// Función para filtrar los Pokemon por nombre.
function filterPokemon(term, page) {
  // Convertir el término de búsqueda a minúsculas para hacer una comparación insensible a mayúsculas.
  const searchTerm = term.toLowerCase();
  // Filtrar los Pokemon por nombre.
  const filteredPokemon = allPokemon.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchTerm);
  });
  // Pintar sólo los Pokemon que coinciden con el término de búsqueda.
  displayPokemon(filteredPokemon, page);
}

// Llamar a la función para recuperar los Pokemon.
fetchPokemon();

let currentPage = 1;

// Agregar un event listener al botón de búsqueda para filtrar los Pokemon.
searchBtn.addEventListener('click', () => {
  // Obtener el término de búsqueda.
  const searchTerm = searchInput.value;
  // Filtrar los Pokemon y pintar sólo los que coinciden con el término de búsqueda.
  filterPokemon(searchTerm, currentPage);
});


previousBtn.addEventListener('click', () => {
  // Decrementar la página actual y llamar a la función para mostrar los Pokemon correspondientes.
  currentPage--;
  displayPokemon(allPokemon, currentPage);
});

nextBtn.addEventListener('click', () => {
  // Incrementar la página actual y llamar a la función para mostrar los Pokemon correspondientes.
  currentPage++;
  displayPokemon(allPokemon, currentPage);
});
// Funcionalidad para que recomiende pokemons en la busqueda 
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    recommendPokemon(searchTerm);
  });
  function recommendPokemon(searchTerm) {
    const matchingPokemon = allPokemon.filter((pokemon) => {
      return pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase());
    });
  
    const recommendedPokemon = matchingPokemon.sort((a, b) => {
      const aScore = countCommonChars(searchTerm, a.name.toLowerCase());
      const bScore = countCommonChars(searchTerm, b.name.toLowerCase());
      return bScore - aScore;
    });
  
    // Mostrar los resultados recomendados en la página.
    displayPokemon(recommendedPokemon, 1);
  }
  function countCommonChars(a, b) {
    let count = 0;
    for (let i = 0; i < a.length && i < b.length; i++) {
      if (a[i] === b[i]) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }
      