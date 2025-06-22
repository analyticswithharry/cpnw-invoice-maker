function formatAsCurrency(amount) {
    const currency = document.getElementById('currency').value;
    const symbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': '$',
        'AUD': '$', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'BRL': 'R$',
        'RUB': '₽', 'KRW': '₩', 'SGD': '$', 'NZD': '$', 'MXN': '$'
    };
    return (symbols[currency] || '$') + Number(amount).toFixed(4);
}

function calculatePrice(row) {
    const quantity = parseFloat(row.querySelector('.quantity').value) || 1;
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

function updateItemSelect() {
    const select = document.getElementById('itemSelect');
    const rows = document.querySelectorAll('.item-row');
    select.innerHTML = '<option value="">Select Item to Remove</option>';
    rows.forEach((row, index) => {
        const productName = row.querySelector('.product-name').value || `Item ${index + 1}`;
        const option = document.createElement('option');
        option.value = index;
        option.textContent = productName;
        select.appendChild(option);
    });
}

function addRow() {
    const table = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <td><input type="text" class="product-name" value="New Product"></td>
        <td><input type="text" class="description" value="Description"></td>
        <td><input type="number" class="quantity" value="1" min="1" max="999" oninput="calculateTotal(); updateItemSelect();"></td>
        <td><input type="number" class="unit-price" value="0.0000" min="0" max="10000" step="0.0001" oninput="calculateTotal(); updateItemSelect();"></td>
        <td><input type="number" class="discount" value="0.0000" min="0" step="0.0001" oninput="calculateTotal(); updateItemSelect();"></td>
        <td class="price">$0.0000</td>
    `;
    table.appendChild(newRow);
    calculateTotal();
    updateItemSelect();
}

function removeSelectedRow() {
    const select = document.getElementById('itemSelect');
    const index = parseInt(select.value);
    if (!isNaN(index)) {
        const rows = document.querySelectorAll('.item-row');
        if (rows[index]) {
            rows[index].remove();
            calculateTotal();
            updateItemSelect();
        }
    }
}

function applyColorPreset() {
    const preset = document.getElementById('colorPreset').value;
    const invoice = document.getElementById('invoice');
    invoice.classList.remove('color-blue', 'color-green', 'color-purple', 'color-orange');
    invoice.classList.add(`color-${preset}`);
}

function adjustLogoSize() {
    const size = document.getElementById('logoSize').value;
    const logo = document.getElementById('logo');
    logo.style.maxWidth = `${size}px`;
    logo.style.maxHeight = `${size}px`;
}

function uploadLogo() {
    const file = document.getElementById('logoUpload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logo = document.getElementById('logo');
            logo.src = e.target.result;
            logo.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function downloadPDF() {
    const clientName = document.getElementById('clientName').value.replace(/[^a-zA-Z0-9]/g, '_') || 'invoice';
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const filename = `${clientName}_${day}_${month}_${year}.pdf`;
    const element = document.getElementById('invoice');
    const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 148mm, windowHeight: 210mm },
        jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().set(opt).from(element).save();
}

document.querySelectorAll('.item-row').forEach(row => {
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            calculatePrice(row);
            calculateTotal();
            updateItemSelect();
        });
    });
});
document.getElementById('taxRate').addEventListener('input', calculateTotal);
applyColorPreset();
calculateTotal();
updateItemSelect();
