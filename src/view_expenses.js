document.addEventListener('DOMContentLoaded', () => {
     const tableBody = document.querySelector('#expenses-table tbody');
   
     // Function to fetch data from the API and populate the table
     async function fetchExpenses() {
       try {
         const response = await fetch('https://expense-tracker-backend-api-endpoints.netlify.app/view_expenses');
         if (!response.ok) {
           throw new Error('Network response was not ok');
         }
         const data = await response.json();
   
         if (data.success && Array.isArray(data.data)) {
           // Clear any existing rows
           tableBody.innerHTML = '';
   
           // Populate the table with the fetched data
           data.data.forEach(expenses => {
             const row = document.createElement('tr');
             row.innerHTML = `
               <td>${expenses.expense_id}</td>
               <td>${expenses.user_id}</td>
               <td>${expenses.category_id}</td>
               <td>${expenses.expense_name}</td>
               <td>${expenses.amount.toFixed(2)}</td>
               <td>${expenses.expense_date}</td>
               <td>${expenses.description}</td>
               <td>${expenses.created_at}</td>
               <td>${expenses.updated_at}</td>
             `;
             tableBody.appendChild(row);
             console.log(row);
           });
         } else {
           console.error('Unexpected data format', data);
           displayError('Unexpected data format received from server.');
         }
       } catch (error) {
         console.error('Error fetching expenses:', error);
         displayError('An error occurred while fetching expenses.');
       }
     }
   
     // Function to display error messages to the user
     function displayError(message) {
       const errorContainer = document.querySelector('#error-container');
       if (errorContainer) {
         errorContainer.textContent = message;
         errorContainer.style.display = 'block';
       }
     }
   
     // Fetch expenses when the page loads
     fetchExpenses();
   });
   