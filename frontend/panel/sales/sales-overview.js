// Wrap the entire code in an initialization function
function initSalesOverview() {
    // Fetch sale details data from the API
    fetch('http://127.0.0.1:3000/api/sale-details')
        .then(response => response.json())
        .then(saleDetailsData => {
            // Fetch product data from the API
            fetch('http://127.0.0.1:3000/api/products')
                .then(response => response.json())
                .then(productData => {
                    // Create a map of product prices
                    const productPriceMap = new Map();
                    productData.forEach(product => {
                        productPriceMap.set(product.product_id, parseFloat(product.price));
                    });

                    // Group sale details by sale_id and calculate total amounts
                    const salesMap = new Map();
                    saleDetailsData.forEach(detail => {
                        if (!salesMap.has(detail.sale_id)) {
                            salesMap.set(detail.sale_id, {
                                saleId: detail.sale_id,
                                totalAmount: 0,
                                details: []
                            });
                        }
                        const saleEntry = salesMap.get(detail.sale_id);
                        const productPrice = productPriceMap.get(detail.product_id) || 0;
                        const subtotal = detail.quantity_sold * productPrice;
                        saleEntry.totalAmount += subtotal;
                        saleEntry.details.push({
                            productName: productData.find(p => p.product_id === detail.product_id).product_name,
                            quantity: detail.quantity_sold,
                            pricePerUnit: productPrice,
                            subtotal: subtotal
                        });
                    });

                    // Convert salesMap to an array
                    const salesData = Array.from(salesMap.values());

                    // Calculate metrics
                    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
                    const transactionCount = salesData.length;
                    const avgOrderValue = transactionCount ? (totalRevenue / transactionCount).toFixed(2) : 0;

                    // Update metric cards
                    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                    document.getElementById('transactionCount').textContent = transactionCount.toLocaleString();
                    document.getElementById('avgOrderValue').textContent = parseFloat(avgOrderValue).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

                    // Top Selling Products (aggregating quantity sold)
                    const productSales = {};
                    salesData.forEach(sale => {
                        sale.details.forEach(detail => {
                            productSales[detail.productName] = (productSales[detail.productName] || 0) + detail.quantity;
                        });
                    });

                    // Get top 5 selling products
                    const topProducts = Object.keys(productSales)
                        .map(productName => ({ productName, quantity: productSales[productName] }))
                        .sort((a, b) => b.quantity - a.quantity)
                        .slice(0, 5);

                    // Populate Top Selling Products Table
                    const topSellingProductsTableBody = document.getElementById('topSellingProductsTable');
                    topSellingProductsTableBody.innerHTML = topProducts.map(product => `
          <tr>
            <td>${product.productName}</td>
            <td>${product.quantity.toLocaleString()}</td>
          </tr>
        `).join('');
                })
                .catch(error => console.error('Error fetching product data:', error));
        })
        .catch(error => console.error('Error fetching sale details:', error));
}

// When DOM is ready, initialize Sales Overview
document.addEventListener("DOMContentLoaded", function () {
    initSalesOverview();
});