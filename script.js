// Function to initialize Firebase asynchronously
function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyD8MILnn0mxAjIymYunOJ9PeOcS8TREN-s",
        authDomain: "mewinghub.firebaseapp.com",
        projectId: "mewinghub",
        storageBucket: "mewinghub.appspot.com",
        messagingSenderId: "1002076070934",
        appId: "1:1002076070934:web:74e962a275a0c64c514137",
    };

    return firebase.initializeApp(firebaseConfig);
}

// Function to display uploaded images in the gallery
function displayImages() {
    var imageGallery = document.getElementById('image-gallery');
    imageGallery.innerHTML = '';

    uploadedImages.forEach(function (image, index) {
        var imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        var img = document.createElement('img');
        img.src = image.imageUrl;
        img.style.maxWidth = '100%';
        imageContainer.appendChild(img);

        var createdBy = document.createElement('span');
        createdBy.textContent = 'Uploaded by: ' + image.name;
        imageContainer.appendChild(createdBy);

        var likeButton = document.createElement('button');
        likeButton.textContent = 'Like';
        likeButton.addEventListener('click', function () {
            likeImage(index);
        });
        imageContainer.appendChild(likeButton);

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteImage(index);
        });
        imageContainer.appendChild(deleteButton);

        var likesCount = document.createElement('span');
        likesCount.textContent = 'Likes: ' + image.likes;
        imageContainer.appendChild(likesCount);

        imageGallery.appendChild(imageContainer);
    });
}

// Function to handle taking a photo using the camera
document.getElementById('take-photo-button').addEventListener('click', function () {
    var constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            var video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            video.addEventListener('canplay', function () {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                var imageUrl = canvas.toDataURL('image/png');
                saveImageLocally(imageUrl);
            });
        })
        .catch(function (err) {
            console.error('Error accessing camera: ', err);
        });
});

// Function to save image locally on the webpage and in localStorage
function saveImageLocally(imageUrl) {
    const nameInput = document.getElementById('nameInput').value;

    if (!nameInput) {
        alert('Please enter your name.');
        return;
    }

    // Create object representing the uploaded image
    var uploadedImage = {
        name: nameInput,
        imageUrl: imageUrl,
        likes: 0 // Initial likes count
    };

    // Add the uploaded image to the array
    uploadedImages.push(uploadedImage);

    // Save uploaded images to localStorage
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));

    // Display the updated images
    displayImages();
}

// Function to delete an image
function deleteImage(index) {
    uploadedImages.splice(index, 1);

    // Save uploaded images to localStorage
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));

    displayImages();
}

// Function to like an image
function likeImage(index) {
    uploadedImages[index].likes++;

    // Save uploaded images to localStorage
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));

    displayImages();
}

// Initialize uploadedImages array with images from localStorage if available
var uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];

// Initialize Firebase asynchronously
initializeFirebase().then(() => {
    console.log("Firebase initialized successfully!");
    // Start displaying images after Firebase initialization
    displayImages();
}).catch((error) => {
    console.error("Error initializing Firebase: ", error);
});

// Check for errors in Firebase initialization
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in.");
    } else {
        console.log("No user is signed in.");
    }
});
