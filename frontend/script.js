$(document).ready(function () {
  // Fetch daily fact
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

  // File upload handling
  const dropZone = $("#drop-zone");
  const fileInput = $("#fileInput");
  const preview = $("#preview");

  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.on(eventName, preventDefaults);
    $(document).on(eventName, preventDefaults);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Handle drag & drop
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

  // Handle click upload
  dropZone.on("click", function () {
    fileInput.click();
  });

  fileInput.on("change", function () {
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
          const col = $("<div>").addClass("col-md-4").append(img);
          preview.append(col);
        },
        error: function () {
          alert("Failed to upload image. Please try again.");
        },
      });
    });
  }
});
