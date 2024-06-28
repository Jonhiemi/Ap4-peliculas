let peliculas_destacadas = document.getElementById("peliculas-destacadas");
let peliculas = document.getElementById("peliculas");
let button_popular = document.getElementById("button-popular");
let button_top_rated = document.getElementById("button-top-rated");
let modal_body = document.getElementById("modal-body");
let spinner_modal = document.getElementById("spinner_modal");

const url_movies_popular = "https://api.themoviedb.org/3/movie/popular";
const url_movies_top_rated = "https://api.themoviedb.org/3/movie/top_rated";
const url_movie_detail = "https://api.themoviedb.org/3/movie";
const language = "es-MX";
const page = 1;
const api_key = "046e29b7eee12f9aa56c49ed8970d6a3";

const spinner = `
  <div class="d-flex justify-content-center align-items-center" style="height: 400px;">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;

if (button_popular) {
  button_popular.addEventListener("click", () => cargarPeliculasPorTipos("popular"));
}

if (button_top_rated) {
  button_top_rated.addEventListener("click", () => cargarPeliculasPorTipos("top_rated"));
}

async function cargarDatosDePeliculaPorId(id) {
  try {
    modal_body.innerHTML = spinner;
    const respuesta = await fetch(`${url_movie_detail}/${id}?api_key=${api_key}&language=${language}`);
    if (respuesta.status === 200) {
      const data = await respuesta.json();
      modal_body.innerHTML = `
        <div class="card mb-3 border border-0">
          <div class="row g-0">
            <div class="col-12 col-sm-6 d-flex justify-content-center">
              <img src="https://image.tmdb.org/t/p/w300${data.poster_path}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-12 col-sm-6">
              <div class="card-body">
                <h5 class="card-title">${data.title}</h5>
                <p class="card-text">${data.overview}</p>
                <p class="card-text"><small class="text-body-secondary">${data.release_date}</small></p>
                <p>Calificación: ${data.vote_average}</p>
              </div>
            </div>
          </div>
        </div>`;
    } else if (respuesta.status === 401) {
      console.log("Error de logueo.");
    } else {
      console.log(`Error al realizar la solicitud. Código de error: ${respuesta.status}`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function cargarPeliculasPorTipos(type) {
  try {
    let url;
    let contenido_peliculas_destacadas_response = "";
    let contenido_peliculas_response = "";

    if (type === "top_rated") {
      url = url_movies_top_rated;
    } else if (type === "popular") {
      url = url_movies_popular;
    }

    peliculas_destacadas.innerHTML = spinner;

    const respuesta = await fetch(`${url}?api_key=${api_key}&language=${language}&page=${page}`);
    if (respuesta.status === 200) {
      const data = await respuesta.json();
      for (let i = 0; i < 4; i++) {
        contenido_peliculas_destacadas_response += `
          <div class="col-12 col-md-6 col-lg-3 py-2 p-sn-2">
            <div class="card peliculas-card shadow" data-bs-toggle="modal" data-bs-target="#pelicula-modal" data-pelicula-id="${data.results[i].id}">
              <h3>${data.results[i].title}</h3>
              <img src="https://image.tmdb.org/t/p/w300${data.results[i].poster_path}" class="img-fluid" alt="...">
            </div>
          </div>`;
      }
      for (let j = 4; j < data.results.length; j++) {
        contenido_peliculas_response += `
          <div class="col-12 col-md-6 col-lg-3 py-2 p-sn-2">
            <div class="card peliculas-card shadow" data-bs-toggle="modal" data-bs-target="#pelicula-modal" data-pelicula-id="${data.results[j].id}">
              <h3>${data.results[j].title}</h3>
              <img src="https://image.tmdb.org/t/p/w300${data.results[j].backdrop_path}" class="img-fluid" alt="...">
            </div>
          </div>`;
      }
      peliculas_destacadas.innerHTML = contenido_peliculas_destacadas_response;
      peliculas.innerHTML = contenido_peliculas_response;
    } else if (respuesta.status === 401) {
      console.log("Error de logueo.");
    } else {
      console.log(`Error al realizar la solicitud. Código de error: ${respuesta.status}`);
    }
  } catch (error) {
    console.log(error);
  }
}

document.getElementById('pelicula-modal').addEventListener('show.bs.modal', async (event) => {
  let id = event.relatedTarget.dataset.peliculaId;
  await cargarDatosDePeliculaPorId(id);
});

cargarPeliculasPorTipos('popular');
