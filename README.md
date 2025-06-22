##### Invoice Generator

A product-based invoice generator with dynamic product entries, tax calculations, and PDF export.


##### How to Use

Paste Details: Enter company, client, and invoice details in the provided fields.Add Products: Click "Add Product" to include items, filling in product name, description, quantity, unit price, and discount.Adjust Totals: Modify tax rate, other fees, or 
deposit to update the invoice total automatically.Generate PDF: Click "Download as PDF" to export the invoice.

##### Setup

Install Dependencies:

```
npm install
```

Run Locally:

```
node server.js
```
```
Access at http://localhost:3000.

```
##### Deploy to Netlify


```
Push to GitHub:
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```
##### Deploy on Netlify:

Go to Netlify.

Click Add new site 

Import an existing project.

Connect to GitHub and select your repository.

Set Publish directory: public.Click Deploy site. 


##### Notes

server.js is for local development only; Netlify serves static files from public/.Requires express for the local server.