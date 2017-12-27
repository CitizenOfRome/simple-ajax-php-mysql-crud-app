(function() {
    'use strict';
    var BASE_URL = 'http://192.168.0.110/cross-platform-app-course-december-2017/simple-ajax-php-mysql-crud-backend';
    function getExistingRecords() {
        var existingRecords = localStorage.getItem('students');
        if(!existingRecords) {
            existingRecords = {};
        } else {
            try {
                existingRecords = JSON.parse(existingRecords);
            } catch(err) {
                console.error('An error occured in parsing existing records', err);
                existingRecords = {};
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
        var setupRecords = function(result) {
            var existingRecords = JSON.parse(result),
                htmlMarkup = '',
                i = 0;
            // 2. Loop over the student data and generate HTML
            for(var key in existingRecords) {
                if(!existingRecords.hasOwnProperty(key)) {
                    continue;
                }
                var student = existingRecords[key];
                console.log('student', student);
                htmlMarkup += '<tr>\
                  <th scope="row" data-name="id" data-value="' + student.id + '">' + student.id + '</th>\
                  <td data-name="name" data-value="' + student.name + '">' + student.name + '</td>\
                  <td data-name="specialization" data-value="' + student.specialization + '">' + student.specialization + '</td>\
                  <td data-name="age" data-value="' + student.age + '">' + student.age + '</td>\
                  <td>\
                    <button type="button" class="btn btn-primary" onclick="editRecord('+i+')">Edit</button>\
                    <button type="button" class="btn btn-danger" onclick="deleteRecord('+student.id+')">Delete</button>\
                  </td>\
                </tr>';
                i++;
            }
            // 3. Add student data into the HTML dynamically
            document.getElementById('studentDataWrapper').innerHTML = htmlMarkup;
        };
        var searchName = document.getElementById('searchName').value,
            searchSpecialization = document.getElementById('searchSpecialization').value,
            searchAge = document.getElementById('searchAge').value;
        fetch(new Request(BASE_URL + '/getRecords.php?searchName='+searchName+'&searchSpecialization='+searchSpecialization+'&searchAge='+searchAge), {
            method: "GET"
        }).then(function(response) {
            console.log('Done fetch', response);
            return response.text().then(function(result) {
                localStorage.setItem('students', result);
                setupRecords(result);
            });
        }).catch(function() {
            console.warn('Failed to get response');
            setupRecords(localStorage.getItem('students') || '{}');
        });
    }
    // 3. Allow editing data - Update
    function editRecord(index) {
        // 1. Getting the data from localStorage and populating the form
        var rows = document.getElementById('studentDataWrapper').children,
            cols = rows[index].children,
            currentRecord = {};
        for(var i = 0; i < cols.length; i++) {
            var name = cols[i].getAttribute('data-name');
            if(name) {
                currentRecord[name] = cols[i].getAttribute('data-value');
            }
        }
        console.log('editRecord', index, currentRecord);
        document.getElementById('name').value = currentRecord.name;
        document.getElementById('specialization').value = currentRecord.specialization;
        document.getElementById('age').value = currentRecord.age;
        // 2. Save the updated data at the correct place
        document.getElementById('currentRecordIndex').value = currentRecord.id;
    }
    // 4. Allow deleting data - Deletion
    function deleteRecord(id) {
        if(confirm('Are you sure they want to delete this record?')) {
            fetch(new Request(BASE_URL + '/deleteRecord.php'), {
                method: "POST",
                body: JSON.stringify({
                    id: id
                })
            }).then(function () {
                displayRecords();
            });
        }
    }
    function clearSearch() {
        document.getElementById('searchName').value = '';
        document.getElementById('searchSpecialization').value = '';
        document.getElementById('searchAge').value = '';
        displayRecords();
    }
    displayRecords();
    window.saveRecord = saveRecord;
    window.editRecord = editRecord;
    window.deleteRecord = deleteRecord;
    window.searchRecords = displayRecords;
    window.clearSearch = clearSearch;
})();