const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MySQL connection configuration
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'mydatabase',
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Express routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/createTable', (req, res) => {
    const tableName = req.body.tableName;
    const fields = req.body.fields;
    const fieldTypes = req.body.fieldTypes;
  
    // Create a table in MySQL
    const sql = `CREATE TABLE ${tableName} (${fields.map((field, index) => `${field} ${fieldTypes[index]}`).join(', ')})`;
  
    connection.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error creating table.');
        } else {
            res.send('Table created successfully.');
            res.redirect('/');
        }
    });
});
  
 


app.get('/showTables', (req, res) => {
  // Show all tables query
  const showTablesQuery = 'SHOW TABLES;';

  connection.query(showTablesQuery, (err, result) => {
    if (err) {
      console.error('Error fetching tables:', err);
      res.status(500).send('Error fetching tables');
    } else {
      const tables = result.map(row => row[`Tables_in_${connection.config.database}`]);
      res.send(JSON.stringify(tables));
    }
  });
});
// Add this route to app.js

app.get('/getRecords/:tableName', (req, res) => {
    const tableName = req.params.tableName;
  
    // Fetch records query
    const fetchRecordsQuery = `SELECT * FROM ${tableName}`;
    console.log("Query:", fetchRecordsQuery); 
    connection.query(fetchRecordsQuery, (err, result) => {
      if (err) {
        console.error('Error fetching records:', err);
        res.status(500).send('Error fetching records');
      } else {
        const records = result;
        res.json(records);
      }
    });
});

app.delete('/deleteRecords/:id/:tableName', (req, res) => {
  const id = req.params.id;
  const table = req.params.tableName;

  const deleteRecordsQuery = `DELETE FROM ${table} WHERE Id=${id}`;
  console.log(deleteRecordsQuery);

  connection.query(deleteRecordsQuery, (err, result) => {
    if (err) {
      console.error('Error deleting record:', err);
      res.status(500).send('Error deleting record');
    } else {
      console.log('Record deleted successfully');
      res.send('Record deleted successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
