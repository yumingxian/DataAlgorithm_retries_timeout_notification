const axios = require('axios');
const mysql = require('mysql');
const nodemailer = require('nodemailer');


const con = mysql.createConnection({
    host: '10.11.90.16',
    user: 'AppUser',
    password: 'Special888%',
    database: 'dtrends'
});
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'aaaa.zhao@g.northernacademy.org',
        pass: 'qwer1234',
    },
});
const mailOptions = {
    from: 'aaaa.zhao@g.northernacademy.org',
    to: 'yumingxian7012@gmail.com',
    subject: 'Error Appearance From Covid Data Algorithm',
    html: 'Data can not insert.',
};


let x = 0;
axiosReq();

function axiosReq() {
    axios.get('https://dmo.pygeoapi.io/covid-19/collections/cases/items?f=json')
        .then((response) => {

            // console.log(response.data.features.length);
            // for (let i = 0; i < 2; i++) {
            //
            //
            //     var continent = "SELECT Continent_name FROM dtrends.Continent WHERE Country = ?;"
            //
            //     con.query(continent, [response.data.features[i].properties.Country_Region], function (err, continents) {
            //         if (err) throw err;
            //         var d = new Date(parseInt(response.data.features[i].properties.Last_Update));
            //         var date = d.getFullYear() + '-' + ("0" + d.getMonth()).slice(-2) + '-' + d.getDate();
            //         var layername = 'coronav_' + ("0" + d.getMonth()).slice(-2) + ("0" + d.getDate()).slice(-2) + d.getFullYear() + '_' + response.data.features[i].properties.Country_Region;
            //         // console.log("get continents");
            //         // console.log(continents[0].Continent_name);
            //         // console.log("hello");
            //         // console.log(layername);
            //         var sql = "INSERT INTO dtrends.layers_bak20200909(Date, LayerName, LayerType, FirstLayer, SecondLayer, DisplayName, CaseNum, DeathNum, RecovNum," +
            //             " ActiveNum, Latitude, Longitude,CityName, StateName, CountryName, ContinentName, Color_Confirmed, Color_Death, Color_Recovered) " +
            //             "VALUES (?,?,'H_PKLayer','Corona_Virus','',?,?,?,?,?,?,?,'',?,?,?,'rgb(220,0,0) rgb(220,0,0) rgb(220,0,0)','rgb(0,0,0) rgb(0,0,0) rgb(0,0,0)','rgb(124,252,0) rgb(124,252,0) rgb(124,252,0)'); ";
            //
            //         con.query(sql, [date, layername, response.data.features[i].properties.Country_Region, response.data.features[i].properties.Confirmed,
            //             response.data.features[i].properties.Deaths, response.data.features[i].properties.Recovered,
            //             response.data.features[i].properties.Active, response.data.features[i].properties.Lat,
            //             response.data.features[i].properties.Long_, response.data.features[i].properties.Province_State,
            //             response.data.features[i].properties.Country_Region, continents[0].Continent_name], function (err, result) {
            //             if (err) throw err;
            //             console.log("1 record inserted");
            //         });
            //     });
            // }
            // console.log('while: ' + x);
            // x = 1;
            // console.log("Axios: " + x);
            // console.log(1< x && x < 5);
            // break
            // return y;
            console.log("Axios ");
        })
        .catch(error => {

            console.log("error ");
            Timeout();
            x += 1;


        });

}
function Timeout() {

    setTimeout(function() {
        if (x < 10) {
            axiosReq();
            // setTimeout(axiosReq(), 10000);
        } else {
            // console.log('error1');
            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                }
                console.log(`Message sent: ${info.response}`);
            });
        }
    }, 5000);
}