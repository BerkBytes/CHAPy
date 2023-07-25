const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const ini = require('ini');

// Get references to DOM elements
const fileSelectionForm = document.getElementById('file-selection-form');
const dataStructureForm = document.getElementById('data-structure-form');
const dataStructureSubmit = document.getElementById('data-structure-submit');

// Read the data directory and create checkboxes for each file
fs.readdir(path.join(__dirname, 'data'), (err, files) => {
    if (err) {
        console.error(`Error reading data directory: ${err}`);
        return;
    }
    console.log(__dirname);
    console.log('Files found:', files); // Log files found

    files.forEach(file => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = file;
        checkbox.id = file;

        const label = document.createElement('label');
        label.htmlFor = file;
        label.textContent = file;

        fileSelectionForm.appendChild(checkbox);
        fileSelectionForm.appendChild(label);
    });
});

// Add event listener to the file selection form
fileSelectionForm.addEventListener('submit', event => {
    event.preventDefault();

    // Get the names of the selected files
    const selectedFiles = [...fileSelectionForm.elements]
        .filter(element => element.checked)
        .map(element => element.name);

    if (!selectedFiles.length) {
        console.log('No files selected');
        return;
    }

    // Read the first selected file to get column names
    fs.createReadStream(path.join(__dirname, 'data', selectedFiles[0]))
        .pipe(csvParser())
        .on('headers', headers => {
            headers.forEach(header => {
                const columnElement = document.createElement('div');

                const columnName = document.createElement('input');
                columnName.type = 'text';
                columnName.value = header;
                columnName.readOnly = true;
                columnElement.appendChild(columnName);

                const columnType = document.createElement('select');
                ['int', 'float', 'str'].forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    columnType.appendChild(option);
                });
                columnElement.appendChild(columnType);

                const columnDescription = document.createElement('input');
                columnDescription.type = 'text';
                columnElement.appendChild(columnDescription);

                dataStructureForm.appendChild(columnElement);
            });
        });
});

dataStructureSubmit.addEventListener('click', () => {
    // Get the specified data structure
    const dataStructure = Array.from(dataStructureForm.elements)
        .reduce((acc, element, i, arr) => {
            if (i % 3 === 0) { // column name
                acc.push({ name: element.value });
            } else if (i % 3 === 1) { // column type
                acc[acc.length - 1].type = element.value;
            } else { // column description
                acc[acc.length - 1].description = element.value;
            }
            return acc;
        }, []);

    // Get the names of the selected files
    const selectedFiles = [...fileSelectionForm.elements]
        .filter(element => element.checked)
        .map(element => element.name);

    // Create a settings object to write to settings.conf
    const settings = {
        data_file: {
            filename: selectedFiles.join(', ')
        },
        data_structure: {
            columns: dataStructure.map(column => `${column.name}:${column.type}:${column.description}`).join(', ')
        }
    };

    // Write settings to settings.conf
    fs.writeFile('settings.conf', ini.stringify(settings), 'utf-8', err => {
        if (err) {
            console.error(`Error writing settings.conf: ${err}`);
        } else {
            console.log('Successfully wrote settings.conf');
        }
    });
});
