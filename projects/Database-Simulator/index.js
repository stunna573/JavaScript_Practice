alert("yoo")

// Define the insertData function
function insertData(city, country) {
  let table = document.getElementById('dataTable');
  let newRow = table.insertRow();
  let cell1 = newRow.insertCell(0);
  let cell2 = newRow.insertCell(1);
  cell1.textContent = city;
  cell2.textContent = country;
}

function processFormData() {
  let form = document.getElementById('myForm');
  // Debug: check if form exists
  if (!form) {
   alert('Form not found!');
    return;
 }

  // Get values using form.elements with name attributes
  let city = form.elements.city.value.trim();
  let country = form.elements.country.value.trim();

  if (!city || !country) {
    alert('Please fill in both fields');
    return;
  }

  insertData(city, country);

  // Clear inputs
  document.getElementById('city').value = '';
  document.getElementById('country').value = '';

  // Optional: prompt for name
  let userName = prompt("Enter your name:");
  if (userName) {
    let greet = `Hello ${userName}`;
    console.log(userName);
    alert(greet);
  }
}

  // Attach event to the button (renamed from #ro to #submitBtn)
document.getElementById('submitBtn').addEventListener('click', processFormData);

