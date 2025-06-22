function formatAsCurrency(amount) {
    return '$' + Number(amount).toFixed(2);
}

function calculatePrice(row) {
    const quantity = parseFloat(row.querySelector('.quantity').value) || 1; // Default to 1
    const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
    const discount = parseFloat(row.querySelector('.discount').value) || 0;
    const price = (quantity * unitPrice) - discount;
    row.querySelector('.price').textContent = formatAsCurrency(price);
    return price;
}

function calculateTotal() {
    const rows = document.querySelectorAll('.item-row');
    let subtotal = 0;
    rows.forEach(row => {
        subtotal += calculatePrice(row);
    });
    const taxRate = (parseFloat(document.getElementById('taxRate').value) || 0) / 100;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = formatAsCurrency(subtotal);
    document.getElementById('tax').textContent = formatAsCurrency(tax);
    document.getElementById('total').textContent = formatAsCurrency(total);
}

function addRow() {
    const table = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <td><input type="text" class="product-name" value="Product"></td>
        <td><input type="text" class="description" value="Description"></td>
        <td><input type="number" class="quantity" value="1" min="1"></td>
        <td><input type="number" class="unit-price" value="0.00" min="0" step="0.01"></td>
        <td><input type="number" class="discount" value="0.00" min="0" step="0.01"></td>
        <td class="price">$0.00</td>
        <td><button class="btn btn-remove" onclick="removeRow(this)">Remove</button></td>
    `;
    table.appendChild(newRow);
    attachEventListeners(newRow);
    calculateTotal();
}

function removeRow(button) {
    const row = button.closest('tr');
    row.remove();
    calculateTotal();
}

function attachEventListeners(row) {
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            calculatePrice(row);
            calculateTotal();
        });
    });
}

function applyColorPreset() {
    const preset = document.getElementById('colorPreset').value;
    const invoice = document.getElementById('invoice');
    invoice.classList.remove('color-blue', 'color-green', 'color-purple', 'color-orange');
    invoice.classList.add(`color-${preset}`);
}

function downloadPDF() {
    const element = document.getElementById('invoice');
    const opt = {
        margin: [0.2, 0.2, 0.2, 0.2],
        filename: 'product-invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    document.body.style.transform = 'scale(1)';
    document.body.style.width = '100%';
    html2pdf().set(opt).from(element).save().then(() => {
        document.body.style.transform = 'scale(1.2)';
        document.body.style.width = '83.33%';
    });
}

document.querySelectorAll('.item-row').forEach(row => attachEventListeners(row));
document.getElementById('taxRate').addEventListener('input', calculateTotal);
applyColorPreset(); // Initialize default color