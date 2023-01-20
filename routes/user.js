var express = require('express');
var router = express.Router();
var md5 = require("md5");
var db = require("../database");
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get("/getAllUsers", (req, res, next) => {
  let sql = 'select * from user';
  let params = [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

    res.json({
      "message": "success",
      "data": rows
    });

  });
});

router.get("/getUser/:id", (req, res, next) => {
  let sql = 'select * from user where id = ?';
  let params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

    if (row !== undefined) {
      res.json({
        "message": "success",
        "data": row
      });
    } else {
      res.status(404).json("User doesn't find!");
    }
  });
});

router.post("/addUser", (req, res, next) => {
  let errors = [];

  if (!req.body.name) {
    errors.push("No name specified");
  }

  if (!req.body.email) {
    errors.push("No email specified");
  }

  if (!req.body.password) {
    errors.push("No password specified");
  }

  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }

  let data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password)
  }
  let sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';
  let params = [data.name, data.email, data.password];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message })
      return;
    }

    res.status(201).json({
      "message": "success",
      "data": data,
      "id": this.lastID
    });
  });
});

router.patch("/updateUser/:id", (req, res, next) => {
  let sql = "select * from user where id = ?";
  let params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

    if (row !== undefined) {
      let errors = [];

      if (!req.body.name) {
        errors.push("No name specified");
      }

      if (!req.body.email) {
        errors.push("No email specified");
      }

      if (!req.body.password) {
        errors.push("No password specified");
      }

      if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
      }

      let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : undefined,
        id: req.params.id
      }

      db.run(
        `UPDATE user set 
         name = coalesce(?,name), 
         email = coalesce(?,email),
         password = coalesce(?,password)
         WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        (err, result) => {
          if (err) {
            res.status(400).json({ "error": res.message });
            return;
          }
          res.json({
            message: "success",
            data: data
          })
        });
    } else
      res.status(404).json("User didn't exist!");
  });
});

router.delete("/deleteUser/:id", (req, res, next) => {

  db.run(
    'DELETE FROM user WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message });
        return;
      }

      if (this.changes !== 0) {
        res.json({ "message": "deleted", rows: this.changes, "data": result });
      } else {
        res.status(404).send("User doesn't find!");
      }

    });
});


module.exports = router;
