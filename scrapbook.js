$(document).ready(function() {
    saveScrapbooks();
});

//adding a blank page
function addBlankPage() {
    let newPage = $('<div class="page"><h2>New Page</h2><button class="delete-page" onclick="deletePage(this)">🗑 Delete Page</button></div>');
    $('#scrapbook').append(newPage);
}

// deleting a page
function deletePage(button) {
    $(button).parent().remove();
}

// adding text
function addText() {
    let textBox = $('<div class="text-box" contenteditable="true">Type here...</div>');
    let deleteBtn = $('<button class="delete-btn">X</button>');
    
    textBox.append(deleteBtn);
    deleteBtn.on("click", function() {
        textBox.remove();
    });

    $(".page:last").append(textBox);
    textBox.draggable().resizable();
}

// adding images
function addImage(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        let imgElement = $('<div class="image-box"><img src="' + e.target.result + '"><button class="delete-btn">X</button></div>');
        
        imgElement.find(".delete-btn").on("click", function() {
            imgElement.remove();
        });

        $(".page:last").append(imgElement);
        imgElement.draggable()
        imgElement.resizable();
    };
    reader.readAsDataURL(file);
}

// save scrapbook as PDF
function saveToPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    $(".page").each(function (index, page) {
        if (index !== 0) doc.addPage(); // Add new page except for the first one

        // Add text
        let textContent = $(page).find('.text-box').text();
        doc.text(textContent, 10, 20);

        // Add images
        $(page).find('.image-box img').each(function () {
            let imgData = $(this).attr("src");
            doc.addImage(imgData, 'JPEG', 10, 30, 100, 100); // Adjust size
        });
    });

    let fileName = "scrapbook-" + new Date().toISOString().slice(0, 10) + ".pdf";
    doc.save(fileName);

    saveScrapbookToStorage(fileName, "PDF");
}

function saveScrapbookToStorage(fileName, format) {
    let now = new Date();
    let dateStr = now.toLocaleDateString();

    let savedScrapbook = `<div class="saved-item">
        <h4>${fileName}</h4>
        <p>Saved on: ${dateStr}</p>
        <p>Format: ${format}</p>
        <a href="${fileName}" download="${fileName}">📂 Download</a>
    </div>`;
    
    $("#savedScrapbooks").append(savedScrapbook);
}
// load saved scrapbooks
function saveScrapbook() {
    let scrapbookHTML = $("#book").html();
    localStorage.setItem("scrapbookPages", scrapbookHTML);

    let filePreview = $("<div class='file-preview'>📁 Scrapbook " + new Date().toLocaleString() + "</div>");
    $("#saved-files").append(filePreview);

    filePreview.click(function () {
        $("#book").html(scrapbookHTML);
    });
}

// Function to show password modal
function showPasswordModal() {
    document.getElementById("passwordModal").style.display = "block";
}

// Function to check password and display scrapbook
function checkPassword() {
    const enteredPassword = document.getElementById("scrapbookPassword").value;
    const correctPassword = "Memori123"; // Set the password here

    if (enteredPassword === correctPassword) {
        document.getElementById("passwordModal").style.display = "none";
        document.getElementById("scrapbookContainer").style.display = "block";
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
}

// Close modal when clicking outside or on close button
window.onclick = function(event) {
    const modal = document.getElementById("passwordModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("passwordModal").style.display = "none";
});

