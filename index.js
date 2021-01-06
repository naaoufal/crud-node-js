var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var mysql = require('mysql');

var app = express();

// connect to database :
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'crud',
    multipleStatements : true
});

// set views :
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to database :
connection.connect((err) => {
    if(!err)
    console.log("connected to database");
    else
    console.log(err);
});

// display products and categories in table :
app.get('/', (req, res) => {
    let sql = "SELECT * FROM category ; SELECT product.idproduct, product.name, product.price, category.namecate FROM product INNER JOIN category ON product.idcategory = category.idcategory";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('home', {category : rows[0], product : rows[1]});
    });
});

// rende addProduct page + dislpay categories in option :
app.get('/addProduct', (req, res) => {
    let sql = "SELECT * FROM category";
    let query = connection.query(sql, (err, rows) => {
    if(err) throw err;
    res.render('addProduct', {categories : rows});
    });
});

// add new category :
app.post('/saveCategory', (req, res) => {
    let sql = "INSERT INTO category (`namecate`) VALUES (?)";
    let query = connection.query(sql, [req.body.name], (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// rende addCategory page :
app.get('/addCategory', (req, res) => {
    res.render('addCategory');
});

// add new product :
app.post('/saveProducts', (req, res) => {
    let sql = "INSERT INTO product (`name`, `price`, `idcategory`) VALUES ('"+req.body.name+"', '"+req.body.price+"', '"+req.body.idcategory+"')";
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// rend the ID product for udpate :
app.get('/product_edit/:id', (req, res) => {
    let idpro = req.params.id;
    let sql = `SELECT * FROM product WHERE idproduct = ${idpro} ; SELECT * FROM category`;
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('product_edit', {product : result[0], categories : result[1]});
    });
});

// Edit products :
app.post('/updateProduct', (req, res) => {
    let idProduct = req.body.id;
    let namepro = req.body.name;
    let pricepro = req.body.price;
    let categorypro = req.body.idcate;
    let sql = "UPDATE product SET name = '"+namepro+"',price = '"+pricepro+"', idcategory = '"+categorypro+"' WHERE idproduct = '"+idProduct+"'";
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// delete products : 
app.get('/deleteProduct/:id',(req, res) => {
    var sql = "DELETE FROM product WHERE idproduct  = '"+[req.params.id]+"'";
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


// rend the ID category for udpate :
app.get('/category_update/:id', (req, res) => {
    let idcat = req.params.id;
    let sql = `SELECT * FROM category WHERE idcategory = ${idcat} `;
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('category_update', {categories : result[0]});
    });
});


//delete category :
app.get('/deleteCate/:id',(req, res) => {
    var sql = "DELETE FROM category WHERE idcategory  = '"+[req.params.id]+"'";
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


// Edit category :
app.post('/update', (req, res) => {
    let sql = "UPDATE category SET namecate = '"+req.body.name+"' WHERE idcategory = "+req.body.idcate+"";
    console.log(req.body)
    let query = connection.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

// delete category :
// app.get('/delete', (req, res) => {
//     let sql = "DELETE FROM category WHERE id =?", req..id;
// });


// listing on port 3000 :
app.listen(3000, () => {
    console.log("server is running on port 3000 !!!");
});