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

const Datalength = {
    from: 'aaaa.zhao@g.northernacademy.org',
    to: 'yumingxian7012@gmail.com',
    subject: 'Data Length incorrect',
    html: 'Data did not insert.',
};
const sqlconnection = {
    from: 'aaaa.zhao@g.northernacademy.org',
    to: 'yumingxian7012@gmail.com',
    subject: 'SQL Disconnected',
    html: 'SQL Disconnected.',
};
const dataerror = {
    from: 'aaaa.zhao@g.northernacademy.org',
    to: 'yumingxian7012@gmail.com',
    subject: 'Data did not insert correctly.',
    html: 'Data did not insert correctly.',
};


let x = 0;
axiosReq();
setInterval(axiosReq, 2000);
let diflimit = 10;

function axiosReq() {

    con.connect(function (err) {
        if (err) {
            transport.sendMail(sqlconnection, (error, info) => {
                if (error) {
                    console.log(error);
                }
                console.log(`Message sent: ${info.response}`);
            });
        }
        console.log("MySql Connected")

    });
    axios.get('https://demo.pygeoapi.io/covid-19/collections/cases/items?f=json&limit=10000')
        .then((response) => {
            //console.log(response.data.features.length);
            var d = new Date();
            var y = new Date(d);
            y.setDate(y.getDate() - 1)
            var yesterday = y.getFullYear() + '-' + ("0" + (y.getMonth() + 1)).slice(-2) + '-' + ("0" + y.getDate()).slice(-2);
            var countcheck = "SELECT COUNT(LayerName) AS rowscount FROM dtrends.layers_test WHERE Date = ?;"
            con.query(countcheck, [yesterday], function (err, count) {
                var pointNum = parseFloat(count[0].rowscount);
                var dif = response.data.features.length - pointNum;// minus yesterdays data length, query
                if (Math.abs(dif) > diflimit) {
                    console.log("Differences" + ":" + dif);
                    transport.sendMail(Datalength, (error, info) => {
                        if (error) {
                            console.log(error);
                        }
                        console.log(`Message sent: ${info.response}`);
                    });
                } else {
                    for (let i = 0; i < response.data.features.length; i++) {


                        var continent = "SELECT Continent_name FROM dtrends.Continent WHERE Country LIKE ?;"
                        var stringx = [response.data.features[i].properties.Country_Region].toString();
                        if (stringx.includes('(')) {
                            var x = stringx.substr(0, stringx.indexOf(' '));
                        } else if (stringx.includes(',')) {
                            var x = stringx.substr(0, stringx.indexOf(','));
                            // console.log(x)

                        } else if (stringx.includes('*')) {
                            var x = stringx.substr(0, stringx.indexOf('*'));
                            // console.log(x)
                        } else {
                            var x = stringx;
                        }
                        // console.log(x)


                        con.query(continent, "%" + x + "%", function (err, continents) {
                            //     // console.log(response.data.features[i].properties.Country_Region);
                            //     console.log(i, ": ", continents[0].Continent_name,response.data.features[i].properties.Country_Region);
                            if (response.data.features[i].properties.Province_State == null) {
                                Country_Region_Province_State = response.data.features[i].properties.Country_Region.replace(/ /g, "_")
                            } else {
                                var Country_Region_Province_State_Combine = response.data.features[i].properties.Country_Region + "_" + response.data.features[i].properties.Province_State;
                                Country_Region_Province_State = Country_Region_Province_State_Combine.replace(/ /g, "_")
                            }
                            if (response.data.features[i].properties.Province_State == null) {
                                var Province_State = null;
                            } else {
                                var Province_State = response.data.features[i].properties.Province_State.replace(/ /g, "_");
                            }

                            var d = new Date(parseInt(response.data.features[i].properties.Last_Update));
                            var date = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
                            var layername = 'coronav_' + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + d.getFullYear() + '_' + Country_Region_Province_State;
                            var sql = "INSERT INTO dtrends.layers_test(Date, LayerName, LayerType, FirstLayer, SecondLayer, DisplayName, CaseNum, DeathNum, RecovNum," +
                                " ActiveNum, Latitude, Longitude,CityName, StateName, CountryName, ContinentName, Color_Confirmed, Color_Death, Color_Recovered) " +
                                "VALUES (?,?,'H_PKLayer','Corona_Virus','',?,?,?,?,?,?,?,'',?,?,?,'rgb(220,0,0) rgb(220,0,0) rgb(220,0,0)','rgb(0,0,0) rgb(0,0,0) rgb(0,0,0)','rgb(124,252,0) rgb(124,252,0) rgb(124,252,0)'); ";

                            // var deleting = "DELETE FROM dtrends.layers_test WHERE Date = ?;"

                            con.query(sql, [date, layername, response.data.features[i].properties.Country_Region.replace(/ /g, "_"), response.data.features[i].properties.Confirmed,
                                response.data.features[i].properties.Deaths, response.data.features[i].properties.Recovered,
                                response.data.features[i].properties.Active, response.data.features[i].properties.Lat,
                                response.data.features[i].properties.Long_, Province_State,
                                response.data.features[i].properties.Country_Region.replace(/ /g, "_"), continents[0].Continent_name.replace(/ /g, "_")], function (err, result) {
                                // if (err = "ER_DUP_ENTRY") {
                                //     con.query(deleting, [date], function (err, result) {
                                //         if (err) {
                                //             console.log(err);
                                //         }
                                //         console.log("Duplicate Layers deleted")
                                //
                                //     });

                                // }
                                if (err) {
                                    transport.sendMail(dataerror, (error, info) => {
                                        if (error) {
                                            console.log(error);
                                        }
                                        console.log(`Message sent: ${info.response}`);
                                    });
                                }
                                console.log(i + "record inserted");
                                // }


                            });

                        });
                    }
                }


            });
        })
        .catch(error => {
            console.log("err");
            Timeout();
            x += 1;

        });


}


function Timeout() {
    setTimeout(function () {
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