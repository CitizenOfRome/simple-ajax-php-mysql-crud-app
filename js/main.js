(function() {
    'use strict';
    var BASE_URL = 'http://192.168.43.161/cross-platform-app-course-december-2017/simple-ajax-php-mysql-crud-backend';
    function getExistingRecords() {
        var existingRecords = localStorage.getItem('students');
        if(!existingRecords) {
            existingRecords = [];
        } else {
            try {
                existingRecords = JSON.parse(existingRecords);
            } catch(err) {
                console.error('An error occured in parsing existing records', err);
                existingRecords = [];
            }
        }
        return existingRecords;
    }
    // 1. Allow adding new data - Create
    function saveRecord() {
        var name = document.getElementById('name').value,
            specialization = document.getElementById('specialization').value,
            age = document.getElementById('age').value,
            currentRecord = {
                id: document.getElementById('currentRecordIndex').value,
                name: name,
                specialization: specialization,
                age: age
            };
        document.getElementById('addOrEditRecordForm').reset();
        fetch(new Request(BASE_URL + '/saveRecord.php'), {
            method: "POST",
            body: JSON.stringify(currentRecord)
            // 'id=1&name=name'
        }).then(function () {
            displayRecords();
        });
    }
    // 2. Display Existing data - Read / Display
    function displayRecords() {
        // 1. Getting the student data
        fetch(new Request(BASE_URL + '/getRecords.php'), {
            method: "GET"
        }).then(function(response) {
            console.log('Done fetch', response);
            return response.text().then(function(result) {
                var existingRecords = JSON.parse(result),
                    htmlMarkup = '';
                // 2. Loop over the student data and generate HTML
                for(var key in existingRecords) {
                    if(!existingRecords.hasOwnProperty(key)) {
                        continue;
                    }
                    var student = existingRecords[key];
                    console.log('student', student);
                    htmlMarkup += '<tr>\
                      <th scope="row">' + student.id + '</th>\
                      <td>' + student.name + '</td>\
                      <td>' + student.specialization + '</td>\
                      <td>' + student.age + '</td>\
                      <td>\
                        <button type="button" class="btn btn-primary" onclick="editRecord('+student.id+')">Edit</button>\
                        <button type="button" class="btn btn-danger" onclick="deleteRecord('+student.id+')">Delete</button>\
                      </td>\
                    </tr>';
                }
                // 3. Add student data into the HTML dynamically
                document.getElementById('studentDataWrapper').innerHTML = htmlMarkup;
            });
        });
    }
    // 3. Allow editing data - Update
    function editRecord(index) {
        // 1. Getting the data from localStorage and populating the form
        var existingRecords = getExistingRecords(),
            currentRecord = existingRecords[index];
        console.log('editRecord', index, currentRecord);
        document.getElementById('name').value = currentRecord.name;
        document.getElementById('specialization').value = currentRecord.specialization;
        document.getElementById('age').value = currentRecord.age;
        // 2. Save the updated data at the correct place
        document.getElementById('currentRecordIndex').value = index;
    }
    // 4. Allow deleting data - Deletion
    function deleteRecord(index) {
        var existingRecords = getExistingRecords();
        existingRecords.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(existingRecords));
        displayRecords();
    }
    displayRecords();
    window.saveRecord = saveRecord;
    window.editRecord = editRecord;
    window.deleteRecord = deleteRecord;
})();