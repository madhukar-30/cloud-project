document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        if (file.type.startsWith("image/")) {
          preview.innerHTML = `<img src="${e.target.result}" alt="Image preview" style="max-width: 600px; height: auto;">`;
        } else if (file.type === "text/plain") {
          preview.innerHTML = `<pre>${e.target.result}</pre>`;
        } else {
          preview.innerHTML = `<p>Preview not available for this file type.</p>`;
        }
      };

      if (file.type.startsWith("image/") || file.type === "text/plain") {
        reader.readAsDataURL(file);
        reader.readAsText(file);
      } else {
        preview.innerHTML = `<p>Unsupported file type.</p>`;
      }
    } else {
      preview.innerHTML = "";
    }
  });
