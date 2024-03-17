  // Function to display uploaded images in the gallery
 function displayImages() {
    var imageGallery = document.getElementById('image-gallery');
    imageGallery.innerHTML = '';
    var images = JSON.parse(localStorage.getItem('images')) || [];
    images.forEach(function(image, index) {
        var imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        var img = document.createElement('img');
        img.src = image.imageUrl;
        img.style.maxWidth = '100%';
        imageContainer.appendChild(img);

        var likeButton = document.createElement('button');
        likeButton.textContent = 'Like';
        likeButton.className = 'like-button';
        likeButton.dataset.index = index;
        likeButton.addEventListener('click', function() {
            likeImage(index);
        });
        imageContainer.appendChild(likeButton);

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.dataset.index = index;
        deleteButton.addEventListener('click', function() {
            deleteImage(index);
        });
        imageContainer.appendChild(deleteButton);

        var likesCount = document.createElement('span');
        likesCount.textContent = 'Likes: ' + image.likes;
        imageContainer.appendChild(likesCount);

        imageGallery.appendChild(imageContainer);
    });
}

// Function to handle image upload
document.getElementById('image-upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var imageInput = document.getElementById('imageInput');
    var file = imageInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var imageUrl = event.target.result;
            saveImageToLocalStorage(imageUrl);
            displayImages();
        };
        reader.readAsDataURL(file);
    }
});

// Function to save image to localStorage
function saveImageToLocalStorage(imageUrl) {
    var images = JSON.parse(localStorage.getItem('images')) || [];
    images.push({ imageUrl: imageUrl, likes: 0 });
    localStorage.setItem('images', JSON.stringify(images));
    alert('Image uploaded successfully!');
}

// Function to delete an image
function deleteImage(index) {
    var images = JSON.parse(localStorage.getItem('images')) || [];
    images.splice(index, 1);
    localStorage.setItem('images', JSON.stringify(images));
    displayImages();
}

// Function to like an image
function likeImage(index) {
    var images = JSON.parse(localStorage.getItem('images')) || [];
    images[index].likes++;
    localStorage.setItem('images', JSON.stringify(images));
    displayImages();
}

// Initial display of images
displayImages();

// Function to handle taking a photo using the camera
document.getElementById('take-photo-button').addEventListener('click', function() {
    var constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            var video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            video.addEventListener('canplay', function() {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                var imageUrl = canvas.toDataURL('image/png');
                saveImageToLocalStorage(imageUrl);
                displayImages();

                stream.getTracks().forEach(function(track) {
                    track.stop();
                });
            });
        })
        .catch(function(err) {
            console.error('Error accessing camera: ', err);
        });
});

function previewImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const img = document.createElement('img');
        img.src = reader.result;
        imagePreview.appendChild(img);
    }

    reader.readAsDataURL(file);
}

function uploadImage() {
    const nameInput = document.getElementById('nameInput').value;
    const imageFile = document.getElementById('imageInput').files[0];

    if (!nameInput || !imageFile) {
        alert('Please enter your name and choose an image.');
        return;
    }

    const formData = new FormData();
    formData.append('name', nameInput);
    formData.append('image', imageFile);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Image uploaded successfully.');
            document.getElementById('nameInput').value = '';
            document.getElementById('imageInput').value = '';
            document.getElementById('imagePreview').innerHTML = '';
        } else {
            alert('Failed to upload image.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
}
