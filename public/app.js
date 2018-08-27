//Click on Save Button
$(document).on("click", ".saveButton", function () {
  let thisId = $(this).attr("data-id");
  //console.log("Entro al click"),
  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);
    });

})

//Click the unsave Button

$(document).on("click", ".deleteButton", function () {
  let thisId = $(this).attr("data-id");
  //console.log("Entro al click"),
  $.ajax({
    method: "POST",
    url: "/api/unsaved/" + thisId
  })
    .then(function (data) {
      console.log(data);
    });

})

//*Accion al hacer click en ArticleNotes
$(document).on("click", ".noteButton", function () {
  let thisId = $(this).attr("data-id");
  //console.log("El valor del id es: " + thisId)
  $.ajax({
    method: "GET",
    url: "api/article/" + thisId
  })
    .then(function (data) {
      console.log(data)
      $("#ModalLabelNote").text("Notes for Article" + data._id)
      //Primero que limpie don de vas a poner los comentarios
      $("#areaComentario").empty();
      $("#saveNote").attr("data-id", data._id)
      for (let i = 0; i < data.note.length; i++) {
        //Aqui va los comentarios 
        let comentario = $("<div>");
        comentario.addClass("col-8")
        let botonBorrarnota = $("<button>")
        botonBorrarnota.addClass("col-2 btn btn-danger btn-sm borrarNota")
        botonBorrarnota.attr("data-id", data.note[i]._id)
        botonBorrarnota.text("X")
        comentario.text(data.note[i].body);
        $("#areaComentario").append(comentario);
        $("#areaComentario").append(botonBorrarnota);
        $("#areaComentario").append("<hr>");
      }
    })
  $("#modalNote").modal('show');

});

// When you click the savenote button
$(document).on("click", "#saveNote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  //console.log("El id del buton guardar nota es " + thisId)
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/addnote/" + thisId,
    data: {

      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      //console.log(data);
      $("#modalNote").modal('hide');
      // Empty the notes section
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");

});

//* Boton para borrar una nota de un articulo
$(document).on("click", ".borrarNota", function () {
  var thisId = $(this).attr("data-id");
  console.log("El id de la nota es " + thisId);
  $.ajax({
    method: "GET",
    url: "/deletenote/" + thisId
  })
    .then(function (data) {
      //console.log(data);
      $("#modalNote").modal("hide");
    });
})


//* Boton scrape
$(document).on("click", "#scrapeNews", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (data) {
      //console.log(data)
      $("#modalBody").text("You have scrapped " + data.length + " new articles")
      $("#modalScrape").modal("show");
    })

})

//*Reload page after scrap

$(document).on("click","#closeScrapemodal",function(){
  window.location.href="/"
})
