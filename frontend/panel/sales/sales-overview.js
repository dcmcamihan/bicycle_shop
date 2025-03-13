// // Wrap the entire code in an initialization function
// function initSalesOverview() {
//   // Sample sales data for demonstration
//   const salesData = [
//     {
//       saleId: 'S001',
//       date: '2025-03-10',
//       customer: 'Alice Johnson',
//       cashier: 'Bob Smith',
//       totalAmount: 1200,
//       paymentMethod: 'Cash',
//       details: [
//         { productName: 'Bicycle', quantity: 1, pricePerUnit: 800 },
//         { productName: 'Helmet', quantity: 1, pricePerUnit: 200 },
//         { productName: 'Gloves', quantity: 2, pricePerUnit: 100 },
//       ],
//     },
//     {
//       saleId: 'S002',
//       date: '2025-03-11',
//       customer: 'Charlie Davis',
//       cashier: 'Diana Evans',
//       totalAmount: 450,
//       paymentMethod: 'Card',
//       details: [
//         { productName: 'Bicycle', quantity: 1, pricePerUnit: 450 },
//       ],
//     },
//     {
//       saleId: 'S003',
//       date: '2025-03-12',
//       customer: 'Emily White',
//       cashier: 'Frank Brown',
//       totalAmount: 950,
//       paymentMethod: 'Card',
//       details: [
//         { productName: 'Helmet', quantity: 1, pricePerUnit: 150 },
//         { productName: 'Cycling Jersey', quantity: 1, pricePerUnit: 800 },
//       ],
//     },
//   ];
  
//   // Calculate metrics
//   const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
//   const transactionCount = salesData.length;
//   const avgOrderValue = transactionCount ? (totalRevenue / transactionCount).toFixed(2) : 0;
  
//   // Update metric cards
//   document.getElementById('totalRevenue').textContent = `$${totalRevenue}`;
//   document.getElementById('transactionCount').textContent = transactionCount;
//   document.getElementById('avgOrderValue').textContent = `$${avgOrderValue}`;
  
//   // Payment Methods Breakdown
//   const paymentMethods = {};
//   salesData.forEach(sale => {
//     paymentMethods[sale.paymentMethod] = (paymentMethods[sale.paymentMethod] || 0) + sale.totalAmount;
//   });
//   const paymentLabels = Object.keys(paymentMethods);
//   const paymentValues = Object.values(paymentMethods);
  
//   // Top Selling Products (aggregating quantity sold)
//   const productSales = {};
//   salesData.forEach(sale => {
//     sale.details.forEach(detail => {
//       productSales[detail.productName] = (productSales[detail.productName] || 0) + detail.quantity;
//     });
//   });
//   const topProducts = Object.keys(productSales);
//   const topProductValues = Object.values(productSales);
  
//   // Sales Trends (aggregate revenue by date)
//   const salesTrends = {};
//   salesData.forEach(sale => {
//     salesTrends[sale.date] = (salesTrends[sale.date] || 0) + sale.totalAmount;
//   });
//   const trendLabels = Object.keys(salesTrends);
//   const trendValues = Object.values(salesTrends);
  
//   // Render Sales Trends Line Chart
//   const ctxTrends = document.getElementById('salesTrendsChart').getContext('2d');
//   new Chart(ctxTrends, {
//     type: 'line',
//     data: {
//       labels: trendLabels,
//       datasets: [{
//         label: 'Total Revenue',
//         data: trendValues,
//         backgroundColor: 'rgba(171, 13, 7, 0.5)',
//         borderColor: '#ab0d07',
//         borderWidth: 2,
//         fill: true,
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//     }
//   });
  
//   // Render Payment Methods Pie Chart
//   const ctxPayment = document.getElementById('paymentMethodsChart').getContext('2d');
//   new Chart(ctxPayment, {
//     type: 'pie',
//     data: {
//       labels: paymentLabels,
//       datasets: [{
//         data: paymentValues,
//         backgroundColor: ['#2cae74', '#c0392b', '#f1c40f', '#3498db'],
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//     }
//   });
  
//   // Render Top Selling Products Bar Chart
//   const ctxTopProducts = document.getElementById('topSellingChart').getContext('2d');
//   new Chart(ctxTopProducts, {
//     type: 'bar',
//     data: {
//       labels: topProducts,
//       datasets: [{
//         label: 'Units Sold',
//         data: topProductValues,
//         backgroundColor: '#ab0d07',
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//     }
//   });
  
//   // Populate Recent Transactions Table (show last 3 transactions)
//   const recentTransactionsTbody = document.getElementById('recentTransactionsTbody');
//   recentTransactionsTbody.innerHTML = salesData.slice(-3).map(sale => `
//     <tr>
//       <td>${sale.saleId}</td>
//       <td>${sale.date}</td>
//       <td>${sale.customer}</td>
//       <td>$${sale.totalAmount}</td>
//       <td>${sale.paymentMethod}</td>
//     </tr>
//   `).join('');
// }

// // When DOM is ready, initialize Sales Overview
// document.addEventListener("DOMContentLoaded", function () {
//   initSalesOverview();
// });
