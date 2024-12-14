const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit')
var path = require('path');
const fs = require('fs');

router.get('/', function (req, res) {
    res.render('pdf/pdf');
});
router.post('/', (req, res) => {
    try {
        const doc = new PDFDocument()
        let filename = req.body.filename
        // Stripping special characters
        filename = encodeURIComponent(filename) + '.pdf'
        // Setting response to 'attachment' (download).
        // If you use 'inline' here it will automatically open the PDF
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
        res.setHeader('Content-type', 'application/pdf')
        const content = req.body.content
        //   doc.y = 300
        //   doc.text(content, 50, 50)// Add an image, constrain it to a given size, and center it vertically and horizontally
        // doc.pipe(fs.createWriteStream(filename));
        doc.image(path.join(__dirname, '../public/images/avatar/user.png'), {
            fit: [25, 30],
            align: 'center',
            valign: 'center'
        });

        // Add another page
        doc
            .addPage()
            .fontSize(25)
            .text(content, 100, 100);
        // .text('Here is some vector graphics...', 100, 100);

        // Draw a triangle
        doc
            .save()
            .moveTo(100, 150)
            .lineTo(100, 250)
            .lineTo(200, 250)
            .fill('#FF3300');

        // Apply some transforms and render an SVG path with the 'even-odd' fill rule
        doc
            .scale(0.6)
            .translate(470, -380)
            .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('red', 'even-odd')
            .restore();

        // Add some text with annotations
        doc
            .addPage()
            .fillColor('blue')
            .text('Here is a link!', 100, 100)
            .underline(100, 100, 160, 27, { color: '#0000FF' })
            .link(100, 100, 160, 27, 'http://google.com/');
        doc.pipe(res)
        // doc.pipe(fs.createWriteStream(filename));
        doc.end()
    } catch (error) {
        console.error(error);
        // Expected output: ReferenceError: nonExistentFunction is not defined
        // (Note: the exact output may be browser-dependent)
    }
});

module.exports = router