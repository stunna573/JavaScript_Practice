
// function insertData(city, country) {
//     let table = document.getElementById('dataTable');
//     let newRow = table.insertRow();
//     let cell1 = newRow.insertCell(0);
//     let cell2 = newRow.insertCell(1);
//     cell1.textContent = city;
//     cell2.textContent = country;
// }


// function processFormData() {
//    // Access the form
//     let form = document.getElementById('myForm');
//     // Debug: check if form exists
//     if (!form) {
//       alert('Form not found!');
//       return;
//     }

//     //Access the elements by name and get values
//     let city = form.elements.city.value.trim();
//     let country = form.elements.country.value.trim();

//     // Debug: check values
//     console.log('City:', city);
//     console.log('Country:', country);

//     if (!city || !country) {
//       alert('Please fill in both fields');
//       return;
//     }

//     insertData(city, country);

//     document.getElementById('city').value = '';
//     document.getElementById('country').value = '';
    

// }

// Debug: check if button exists
// let btn = document.getElementById('submitBtn');
// if (!btn) {
//     alert('Button not found!');
// } else {
//     btn.addEventListener('click', processFormData);
//     console.log('Button attached successfully');
// }

//   let city = form.elements.city.value;
//   let country = form.elements.country.value;

//   insertData(city, country);
    
//   document.getElementById('city').value = '';
//   document.getElementById('country').value = '';
// };

// function userInput(){
//     let userName = prompt("Enter your name:")
//     let greet = `Hello ${userName}` //template literal
//     console.log(userName)
//     alert(greet)
// }

// document.querySelector("#ro").addEventListener("click", userInput)


