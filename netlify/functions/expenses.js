document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#expenses-table tbody');
  const apiUrl = window.API_URL || 'https://expense-tracker-backend-api-endpoints.netlify.app';

  // Function to fetch data from the API and populate the table
  async function fetchExpenses() {
    try {
      const response = await fetch(`https://expense-tracker-backend-api-endpoints.netlify.app/netlify/functions/expenses`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // Clear any existing rows
        tableBody.innerHTML = '';

        // Populate the table with the fetched data
        data.data.forEach(expense => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${expense.expense_id}</td>
            <td>${expense.user_id}</td>
            <td>${expense.category_id}</td>
            <td>${expense.expense_name}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>${expense.expense_date}</td>
            <td>${expense.description}</td>
            <td>${expense.created_at}</td>
            <td>${expense.updated_at}</td>
          `;
          tableBody.appendChild(row);
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
