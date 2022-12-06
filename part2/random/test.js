// var fs = require('fs')
import fs from 'fs'

const tabs = fs.readFileSync('./tabs.txt', 'utf-8')
.trim()
.split('\r\n')
    .map(line => line.split('\t'))
    .reduce((customers, line) => {
        customers[line[0]] = customers[line[0]] || []
        customers[line[0]].push({
            name: line[1],
            price: line[2],
            quantity: line[3],
        })
        return customers
    }, {})

console.log(JSON.stringify(tabs, null, 2))


// const reader = new FileReader();
//   reader.addEventListener('load', (event) => {
//     img.src = event.target.result;
//   });
//   reader.readAsDataURL(file);

// fetch('./tabs.txt')
//     .then(response => response.text())
//     .then((data) => {
//         console.log(data)
//     })
