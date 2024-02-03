const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'mydatabase'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', (req, res) => {
  res.render('index.html');
});

app.post('/createTable', (req, res) => {
  const tableName = req.body.tableName;
  const fields = req.body.fields;


  const createTableQuery = `CREATE TABLE ${tableName} (${fields})`;

  db.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log(`Table ${tableName} created`);
    res.redirect('/');
  });
});

app.get('/showTables', (req, res) => {

  const showTablesQuery = 'SHOW TABLES';

  db.query(showTablesQuery, (err, result) => {
    if (err) throw err;
    res.render('showTables.html', { tables: result });
  });
});

app.get('/insertRecords/:table', (req, res) => {
  const tableName = req.params.table;

  res.render('insertRecords.html', { tableName });
});

app.post('/insertRecords/:table', (req, res) => {
  const tableName = req.params.table;
  const data = req.body;


  const insertRecordsQuery = `INSERT INTO ${tableName} SET ?`;

  db.query(insertRecordsQuery, data, (err, result) => {
    if (err) throw err;
    console.log('Record inserted');
    res.redirect(`/showRecords/${tableName}`);
  });
});

app.get('/showRecords/:table', (req, res) => {
  const tableName = req.params.table;


  const selectRecordsQuery = `SELECT * FROM ${tableName}`;

  db.query(selectRecordsQuery, (err, result) => {
    if (err) throw err;
    res.render('showRecords.html', { tableName, records: result });
  });
});

app.get('/deleteRecord/:table/:id', (req, res) => {
  const tableName = req.params.table;
  const recordId = req.params.id;

  const deleteRecordQuery = `DELETE FROM ${tableName} WHERE id = ?`;

  db.query(deleteRecordQuery, [recordId], (err, result) => {
    if (err) throw err;
    console.log('Record deleted');
    res.redirect(`/showRecords/${tableName}`);
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
