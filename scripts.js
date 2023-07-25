const { ipcRenderer } = require('electron');
const { exec } = require('child_process');

// References to DOM elements
let form;
let inputField;
let chatContent;

// Function to append a chat message to the chat content
function appendChat(message, sender) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.classList.add(sender);
    chatContent.appendChild(messageElement);
    chatContent.scrollTop = chatContent.scrollHeight; // Scroll to bottom
}

// Function to run the Python script and get the response
function getResponse(message) {
    return new Promise((resolve, reject) => {
        exec(`python3 main.py "${message}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
            } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(new Error(stderr));
            } else {
                console.log(`stdout: ${stdout}`);
                resolve(stdout.trim());
            }
        });
    }).then(response => {
        appendChat(response, 'chatbot');
    }).catch(error => {
        appendChat(`Error: ${error.message}`, 'error');
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    // References to DOM elements
    form = document.getElementById('form');
    inputField = document.getElementById('input-field');
    chatContent = document.getElementById('chat-content');

    // Add an event listener to the form
    if(form) {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            console.log('Submit event detected');

            const userMessage = inputField.value.trim();
            console.log(`User message: ${userMessage}`);
            if (userMessage) {
                inputField.value = '';
                appendChat(userMessage, 'user');
                await getResponse(userMessage);
            }
        });
    }

    // Add event listener to upload data button
    let uploadDataButton = document.getElementById('upload-data');
    if(uploadDataButton) {
        uploadDataButton.addEventListener('click', () => {
            console.log('Upload data button clicked');
            ipcRenderer.send('upload-data');
        });
    }

    // Add event listener to configure data button
    const configureDataButton = document.getElementById('configure-data');
    
    if(configureDataButton) {
        configureDataButton.addEventListener('click', () => {
            console.log('Configure data button clicked');
            ipcRenderer.send('configure-data');
        });
    }
});
