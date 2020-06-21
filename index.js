const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();


app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.sendFile(path.join(__dirname+'/public/usPostalForm.html')))
    .get('/getRate', handlePostalRate);


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

function handlePostalRate(req, res) {
    const weight = req.query.weight;
    const type = req.query.type;
    console.log(weight);
    console.log(type);
    var result;
    switch (String(type)) {
        case "letter-stamped"://Letters (Stamped)
            if (weight > 3) {
                result = 1.00;
            } else {
                result = 0.55 + (Math.floor(weight - 1) * .15);
            }
            break;
        case "letter-metered"://Letters (Metered)
            if (weight > 3) {
                result = 0.95;
            } else {
                result = 0.50 + (Math.floor(weight - 1) * .15);
            }
            break;
        case "large-envelope"://Large Envelopes (Flats)
            result = 1 + (Math.floor(weight - 1) * .15);
            break;
        case "first-class-retail-package"://First-Class Package Service—Retail
            if (weight > 12) {
                result = 5.71;
            } else if (weight >= 8) {
                result = 5.19;
            } else if (weight >= 4) {
                result = 4.39;
            } else {
                result = 3.66;
            }
            break;
        default:
            console.log("error: no type specified");
            break;
    }

    const params = {weight: weight, type: type, result: result.toFixed(2)};

    res.render("pages/postalRate", params);
}
