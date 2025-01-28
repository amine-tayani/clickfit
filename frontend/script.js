$(document).ready(function () {
  $.ajax({
    url: "http://numbersapi.com/1/30/date?json",
    method: "GET",
    success: function (response) {
      $("#fact-content").text(response.text);
    },
    error: function () {
      $("#fact-content").text(
        "Failed to load daily fact. Please try again later."
      );
    },
  });

  const dropZone = $("#drop-zone");
  const filesInput = $("#files");
  const preview = $("#preview");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.on(eventName, preventDefaults);
    $(document).on(eventName, preventDefaults);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  dropZone.on("dragenter dragover", function () {
    $(this).addClass("dragover");
  });

  dropZone.on("dragleave drop", function () {
    $(this).removeClass("dragover");
  });

  dropZone.on("drop", function (e) {
    const files = e.originalEvent.dataTransfer.files;
    handleFiles(files);
  });

  dropZone.on("click", function () {
    filesInput.click();
  });

  filesInput.on("change", function () {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload only image files.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      $.ajax({
        url: "/upload",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          const img = $("<img>")
            .addClass("img-fluid rounded")
            .attr("src", response.path);
          const col = $("<div>").addClass("col-md-4 fade-in").append(img);
          preview.append(col);
        },
        error: function () {
          alert("Failed to upload image. Please try again.");
        },
      });
    });
  }
});
