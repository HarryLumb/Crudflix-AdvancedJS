const displayMessage = function () {
  const update = new URLSearchParams(window.location.search).get("update");
  const add = new URLSearchParams(window.location.search).get("add");

  if (update) {
    document.querySelector(".success-update").classList.remove("d-none");
  }
  if (add) {
    document.querySelector(".success-add").classList.remove("d-none");
  }
};

const addMovie = async function () {
  const name = document.querySelector("#movieTitle").value;
  const genre = document.querySelector("#movieGenre").value;
  const description = document.querySelector("#movieDescription").value;
  const imageURL = document.querySelector("#imageURL").value;

  console.log(name + genre + description + imageURL);

  // Create the product object using the values assigned from above
  const newMovie = {
    name: name, //REQUIRED
    description: description, //REQUIRED
    category: genre, //REQUIRED
    imageUrl:
      "https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80", //REQUIRED
  };
  try {
    const response = await fetch(
      "https://striveschool-api.herokuapp.com/api/movies/",
      {
        method: "POST",
        body: JSON.stringify(newMovie),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZTk3Y2Q0YmUzZDAwMTU4NDVmYzciLCJpYXQiOjE2NjgxNTg4NDksImV4cCI6MTY2OTM2ODQ0OX0.18AwJXWAnEIlDS-WC4W17PmF9g7xIw-3QTdOrWemX5k",
        },
      }
    );

    if (response.ok) {
      window.location.assign("backoffice.html?add=success");
    } else {
      throw new Error("Movie was not added");
    }
  } catch (error) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.innerHTML = error;
  }
};

const getGenre = async () => {
  try {
    const response = await fetch(
      "https://striveschool-api.herokuapp.com/api/movies/",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZTk3Y2Q0YmUzZDAwMTU4NDVmYzciLCJpYXQiOjE2NjgxNTg4NDksImV4cCI6MTY2OTM2ODQ0OX0.18AwJXWAnEIlDS-WC4W17PmF9g7xIw-3QTdOrWemX5k",
        },
      }
    );

    if (response.ok) {
      const movies = await response.json();

      movies.forEach((element) => {
        getMovies(element);
      });
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const getMovies = async function (genre) {
  const movieID = new URLSearchParams(window.location.search).get("editMovie");

  if (movieID) {
    const genre = new URLSearchParams(window.location.search).get("genre");

    const response = await fetch(
      "https://striveschool-api.herokuapp.com/api/movies/" + genre,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZTk3Y2Q0YmUzZDAwMTU4NDVmYzciLCJpYXQiOjE2NjgxNTg4NDksImV4cCI6MTY2OTM2ODQ0OX0.18AwJXWAnEIlDS-WC4W17PmF9g7xIw-3QTdOrWemX5k",
        },
      }
    );

    const movie = await response.json();
    const filter = movie.find((x) => x._id == movieID);
    console.log(filter.name);

    document.querySelector("#movieTitle").value = filter.name;
    document.querySelector("#movieGenre").value = filter.category;
    document.querySelector("#movieDescription").value = filter.description;
    document.querySelector("#imageURL").value = filter.imageUrl;
  }
  try {
    const response = await fetch(
      "https://striveschool-api.herokuapp.com/api/movies/" + genre,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZTk3Y2Q0YmUzZDAwMTU4NDVmYzciLCJpYXQiOjE2NjgxNTg4NDksImV4cCI6MTY2OTM2ODQ0OX0.18AwJXWAnEIlDS-WC4W17PmF9g7xIw-3QTdOrWemX5k",
        },
      }
    );
    if (response.ok) {
      const movies = await response.json();

      movies.forEach((element) => {
        showMovie(element);
      });
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const showMovie = function (movie) {
  const container = document.querySelector(".moviesList");

  const newRow = document.createElement("div");
  newRow.classList.add("row");

  const newCol = document.createElement("div");
  newCol.classList.add("col-md-4");

  const newTitle = document.createElement("strong");
  newTitle.innerHTML = movie.name;

  const buttonsCol = document.createElement("div");
  buttonsCol.classList.add("col-md-8");

  const flex = document.createElement("div");
  flex.classList.add("d-flex", "align-items-right", "justify-content-end");

  const editLink = document.createElement("a");
  editLink.classList.add("text-primary", "mr-5");
  editLink.innerText = "Edit";
  editLink.setAttribute(
    "href",
    "update.html?editMovie=" + movie._id + "&genre=" + movie.category
  );

  const deleteLink = document.createElement("a");
  deleteLink.classList.add("text-primary", "mr-5");
  deleteLink.innerHTML = "Delete";
  deleteLink.setAttribute("href", "?deleteMovie=" + movie._id);

  const linkBreak = document.createElement("hr");

  newCol.appendChild(newTitle);
  newRow.appendChild(newCol);
  newRow.appendChild(buttonsCol);
  container.appendChild(newRow);
  container.appendChild(linkBreak);
  buttonsCol.appendChild(flex);
  flex.appendChild(editLink);
  flex.appendChild(deleteLink);
};

const deleteMovie = async function () {
  const movieID = new URLSearchParams(window.location.search).get(
    "deleteMovie"
  );

  if (!movieID) {
    return;
  }

  const response = await fetch(
    "https://striveschool-api.herokuapp.com/api/movies/" + movieID,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZTk3Y2Q0YmUzZDAwMTU4NDVmYzciLCJpYXQiOjE2NjgxNTg4NDksImV4cCI6MTY2OTM2ODQ0OX0.18AwJXWAnEIlDS-WC4W17PmF9g7xIw-3QTdOrWemX5k",
      },
    }
  );
};

const updateMovie = async function () {
  const movieID = new URLSearchParams(window.location.search).get("editMovie");

  const name = document.querySelector("#movieTitle").value;
  const description = document.querySelector("#movieDescription").value;
  const category = document.querySelector("#movieGenre").value;
  const imageURL = document.querySelector("#imageURL").value;

  const newMovie = {
    name: name,
    description: description,
    category: category,
    imageUrl: imageURL,
  };

  try {
    const response = await fetch(
      "https://striveschool-api.herokuapp.com/api/movies/" + movieID,
      {
        method: "PUT",
        body: JSON.stringify(newMovie),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZTk3Y2Q0YmUzZDAwMTU4NDVmYzciLCJpYXQiOjE2NjgxNTg4NDksImV4cCI6MTY2OTM2ODQ0OX0.18AwJXWAnEIlDS-WC4W17PmF9g7xIw-3QTdOrWemX5k",
        },
      }
    );

    if (response.ok) {
      window.location.assign("backoffice.html?update=success");
    } else {
      throw new Error("Film was not updated");
    }
  } catch (error) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.innerHTML = error;
  }
};

const homePageGenre = async function () {
  try {
    const response = await fetch(
      "https://striveschool-api.herokuapp.com/api/movies/",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZTk3Y2Q0YmUzZDAwMTU4NDVmYzciLCJpYXQiOjE2NjgxNTg4NDksImV4cCI6MTY2OTM2ODQ0OX0.18AwJXWAnEIlDS-WC4W17PmF9g7xIw-3QTdOrWemX5k",
        },
      }
    );

    if (response.ok) {
      const movies = await response.json();

      movies.forEach((element) => {
        homePageMovies(element);
      });
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const homePageMovies = async function (genre) {
  const response = await fetch(
    "https://striveschool-api.herokuapp.com/api/movies/" + genre,
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZTk3Y2Q0YmUzZDAwMTU4NDVmYzciLCJpYXQiOjE2NjgxNTg4NDksImV4cCI6MTY2OTM2ODQ0OX0.18AwJXWAnEIlDS-WC4W17PmF9g7xIw-3QTdOrWemX5k",
      },
    }
  );

  const movies = await response.json();

  movies.forEach((element) => {
    showHomePage(element);
  });
};

let count = 0;

const showHomePage = function (movie) {
  const container = document.querySelector(".row");

  const newCol = document.createElement("div");
  newCol.classList.add("col-md-2");

  const newImage = document.createElement("img");
  newImage.classList.add("movie-cover");
  newImage.setAttribute("src", movie.imageUrl);

  newCol.appendChild(newImage);
  container.appendChild(newCol);
};
