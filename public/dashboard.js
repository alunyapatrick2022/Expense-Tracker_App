
const add = document.getElementById('add-expenses');
const edit = document.getElementById('edit-expenses');
const del = document.getElementById('delete-expense');
const budget = document.getElementById('budget-settings');
// const f = document.getElementById('sign-out');
const g = document.getElementById('user');


function handleAddExpensesClick() {
    window.location.replace('./add_expenses.html');
}

function handleEditExpensesClick() {
    window.location.replace('./edit_expenses.html');
}

function handleDeleteExpenseClick() {
    window.location.replace('./delete_expenses.html');
}

function handleBudgetSettingsClick() {
    window.location.replace('./budget_settings.html');
}

function handleUserClick() {
    window.location.replace('./account_settings.html');
}

// Attach the event listeners to the buttons
add.onclick = handleAddExpensesClick;
edit.onclick = handleEditExpensesClick;
del.onclick = handleDeleteExpenseClick;
budget.onclick = handleBudgetSettingsClick;
