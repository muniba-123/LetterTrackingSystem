const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const { query } = require("express");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "lettertrackingsystem",
});
db.connect((err) => {
  if (err) {
    console.log("Error connecting to Db");
    return;
  }
  console.log("Connection established");
});
app.get("/users/:orgId", (req, res) => {
  db.query(
    "SELECT * FROM user where orgId=" + req.params.orgId,
    (err, result) => {
      if (err) {
        res.status(400).send(err?.toString());
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/organizations", (req, res) => {
  db.query("SELECT * FROM organization", (err, result) => {
    if (err) {
      res.status(400).send(err?.toString());
    } else {
      res.send(result);
    }
  });
});
app.get("/orgUsers/:orgId", (req, res) => {
  if (!req.params.orgId) res.status(400).send("Organization id required.");
  db.query(
    "SELECT * FROM user where orgId=" + req.params.orgId,
    (err, result) => {
      if (err) {
        res.status(400).send(err?.toString());
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/classification", (req, res) => {
  db.query("SELECT * FROM classification", (err, result) => {
    if (err) {
      res.status(400).send(err?.toString());
    } else {
      res.send(result);
    }
  });
});
app.get("/precedence", (req, res) => {
  db.query("SELECT * FROM precedence", (err, result) => {
    if (err) {
      res.status(400).send(err?.toString());
    } else {
      res.send(result);
    }
  });
});
app.get("/envelopSize", (req, res) => {
  db.query("SELECT * FROM envelopSize", (err, result) => {
    if (err) {
      res.status(400).send(err?.toString());
    } else {
      res.send(result);
    }
  });
});
// app.get("/letters", (req, res) => {
//   db.query("SELECT * FROM letterstage", (err, result) => {
//     if (err) {
//       res.status(400).send(err?.toString());
//     } else {
//       res.send(result);
//     }
//   });
// });
app.post("/sendLetter", (req, res) => {
  const userOrg = req.body.userOrg;
  const userId = req.body.userId;
  const letterNo = req.body.letterNo;
  const date = req.body.date;
  const receiverOrg = req.body.receiverOrg;
  const receiver = req.body.receiver;
  const classification = req.body.classification;
  const precedence = req.body.precedence;
  const envelopSize = req.body.envelopSize;
  console.log("query1 done");
  db.query(
    "INSERT INTO letter (letterNo, date, createdBy,creatorOrg,classification,precedence,envelopSize ) VALUES (?,?,?,?,?,?,?)",
    [letterNo, date, userId, userOrg, classification, precedence, envelopSize],
    (err, result1) => {
      if (err || !result1?.insertId) {
        res.status(400).send(err?.toString());
      } else {
        const id = result1.insertId;
        const timestamp = new Date()
          .toISOString()
          .replace("T", " ")
          .slice(0, 19);
        console.log("query2 done");
        db.query(
          "INSERT INTO letter_stage(letterId,fromOrg, toOrg,sentOn, sentBy,sentTo,lastUpdatedOn ) VALUES (?,?,?,?,?,?,?)",
          [id, userOrg, receiverOrg, date, userId, receiver, timestamp],
          (err, result) => {
            if (err) {
              res.status(400).send(err?.toString());
            } else {
              console.log("query3 done");

              res.send({
                letterId: id,
                message: "Letter has been sent successfully",
              });
            }
          }
        );
      }
    }
  );
});
app.get("/trackLetter/:letterId", (req, res) => {
  const query=  `SELECT letterId,fromOrg, toOrg,sentOn,status,receivedBy,receivedOn FROM letter_stage where letterId=${req.params.letterId} order by lastUpdatedOn Desc;`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send(err?.toString());
    } else {
      res.send(result);
    }
  });
});
app.put("/markLetterReceived", (req, res) => {
  const letterId = req.body.letterId;
  const receivedBy = req.body.receivedBy;
  const receivedOn = req.body.receivedOn;
  const fromOrg = req.body.fromOrg;
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  //check whether such leter with this fromOrg Exists or not
  const query = `SELECT * FROM letter_stage WHERE letterId = ${letterId} and fromOrg=${fromOrg}`;
  db.query(query, (err, result) => {
    if (!result || result?.length === 0)
      res.status(404).send("No such letter from this organization exists");
    else if (err) res.status(400).send(err?.toString());
    else {
      db.query(
        "UPDATE letter_stage SET status = ?,receivedBy=?,receivedOn=?,lastUpdatedOn=? WHERE letterId = ? and fromOrg=?",
        [2, receivedBy, receivedOn, timestamp, letterId, fromOrg],
        (err, result) => {
          if (err) {
            res.status(400).send(err?.toString());
          } else {
            res.send(result);
          }
        }
      );
    }
  });
});
app.post("/forwardLetter", (req, res) => {
  const userId = req.body.userId;
  const userOrg = req.body.userOrg;
  const receiverOrg = req.body.receiverOrg;
  const receiver = req.body.receiver;
  const letterId = req.body.letterId;
  const sentOn = req.body.sentOn;
        const timestamp = new Date()
          .toISOString()
          .replace("T", " ")
          .slice(0, 19);
        console.log("query1 done");
        const query = `SELECT * FROM letter_stage WHERE letterId = ${letterId} and toOrg=${receiverOrg} and fromOrg=${userOrg}`;
        db.query(query, (err, result) => {
          if (err) res.status(400).send(err?.toString());
          else if (result?.length > 0)
            res
              .status(400)
              .send(
                "There is already a letter with this id forwarded from this organization."
              );
          else {
            db.query(
              "INSERT INTO letter_stage(letterId,fromOrg, toOrg,sentOn, sentBy,sentTo,lastUpdatedOn ) VALUES (?,?,?,?,?,?,?)",
              [
                letterId,
                userOrg,
                receiverOrg,
                sentOn,
                userId,
                receiver,
                timestamp,
              ],
              (err, result) => {
                if (err) {
                  res.status(400).send(err?.toString());
                } else {
                  console.log("query2 done");
                  res.send({
                    letterId: letterId,
                    message: "Letter has been forwarded successfully",
                  });
                }
              }
            );
          }
        });
      }
    );

// Admin APIs
app.post("/createUser", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const userOrg = req.body.userOrg;
  const status = req.body.status;
  const query = `SELECT * FROM user WHERE name ='${userName}'`;
  db.query(query, (err, result) => {
    if (err) res.status(400).send(err?.toString());
    else {
      if (!result || result?.length > 0)
        res.status(400).send("Username is already taken");
      else {
        db.query(
          "INSERT INTO user(name,password,orgId,status) VALUES (?,?,?,?)",
          [userName, password, userOrg, status],
          (err, result) => {
            if (err || !result || result?.length === 0) {
              res.status(400).send(err?.toString());
            } else {
              res.send(result);
            }
          }
        );
      }
    }
  });
});
app.put("/changePassword", (req, res) => {
  const userId = req.body.userId;
  const password = req.body.newPassword;
  db.query(
    `UPDATE user SET password ='${password}' WHERE id='${userId}'`,
    (err, result) => {
      if (err) {
        res.status(400).send(err?.toString());
      } else {
        res.send(result);
      }
    }
  );
});
app.post("/createOrg", (req, res) => {
  const name = req.body.name;
  const query = `SELECT * FROM organization WHERE name ='${name}'`;
  db.query(query, (err, result) => {
    if (err) res.status(400).send(err?.toString());
    else {
      if (!result || result?.length > 0)
        res.status(400).send("There is already an organization with this name.");
      else {
        db.query(
          "INSERT INTO organization(name) VALUES (?)",
          [name],
          (err, result) => {
            if (err || !result || result?.length === 0) {
              res.status(400).send(err?.toString());
            } else {
              res.send(result);
            }
          }
        );
      }
    }
  });
});
app.get("/users", (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) {
      res.status(400).send(err?.toString());
    } else {
      res.send(result);
    }
  });
});
app.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  db.query(
    `SELECT * FROM user where name='${userName}' and password='${password}'`,
    (err, result) => {
      if (err) {
        res.status(400).send(err?.toString());
      } else {
        if (result?.length < 1) res.status(401).send("Unauthenticated");
        else res.send(result);
      }
    }
  );
});

// ************************************batch apis **************************************

app.post("/sendBatch", (req, res) => {
  const userId = req.body.userId;
  const userOrg = req.body.userOrg;
  const createdOn = req.body.createdOn;
  const title = req.body.title;
  const letters = req.body.letters;
  const receiverOrg = req.body.receiverOrg;
  db.query(
    "INSERT INTO batch (title, createdOn, createdBy,creatorOrg) VALUES (?,?,?,?)",
    [title, createdOn, userId, userOrg],
    (err, result1) => {
      if (err || !result1?.insertId) {
        res.status(400).send(err?.toString());
      } else {
        const batchId = result1.insertId;
        console.log("query1 done");
        const timestamp = new Date()
          .toISOString()
          .replace("T", " ")
          .slice(0, 19);
        const values = [];
         let letterInfo = [];
        letters.forEach((letterId) => {
          letterInfo.push(letterId);
          letterInfo.push(batchId);
          values.push(letterInfo);
          letterInfo=[]
        });
        db.query(
          "INSERT INTO letter_batch(letterId,batchId) VALUES ?",
          [values],
          (err, result) => {
            if (err) {
              res.status(400).send(err?.toString());
            } else {
              console.log("query2 done");
              db.query(
                "INSERT INTO batch_stage(batchId,fromOrg, toOrg,sentOn, sentBy,lastUpdatedOn,status ) VALUES (?,?,?,?,?,?,?)",
                [batchId, userOrg, receiverOrg, createdOn, userId, timestamp,1],
                (err, result) => {
                  if (err) {
                    res.status(400).send(err?.toString());
                  } else {
                    console.log("query3 done");
                    res.send({
                      batchId: batchId,
                      message: "Batch has been sent successfully",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
app.put("/markBatchReceived", (req, res) => {
  const batchId = req.body.batchId;
  const receivedBy = req.body.receivedBy;
  const receivedOn = req.body.receivedOn;
  const fromOrg = req.body.fromOrg;
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  //check whether such batch with this fromOrg Exists or not
  const query = `SELECT * FROM batch_stage WHERE batchId = ${batchId} and fromOrg=${fromOrg}`;
  db.query(query, (err, result) => {
    if (!result || result?.length === 0)
      res.status(404).send("No such batch from this organization exists");
    else if (err) res.status(400).send(err?.toString());
    else {
      db.query(
        "UPDATE batch_stage SET status = ?,receivedBy=?,receivedOn=?,lastUpdatedOn=? WHERE batchId = ? and fromOrg=?",
        [2, receivedBy, receivedOn, timestamp, batchId, fromOrg],
        (err, result) => {
          if (err) {
            res.status(400).send(err?.toString());
          } else {
            res.send(result);
          }
        }
      );
    }
  });
});
app.get("/trackBatch/:batchId", (req, res) => {
  const query=  `SELECT batchId,fromOrg, toOrg,sentOn, status,receivedBy,receivedOn FROM batch_stage where batchId=${req.params.batchId} order by lastUpdatedOn Desc`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send(err?.toString());
    } else {
      res.send(result);
    }
  });
});
app.post("/forwardBatch", (req, res) => {
  const userId = req.body.userId;
  const userOrg = req.body.userOrg;
  const receiverOrg = req.body.receiverOrg;
  const receiver = req.body.receiver;
  const batchId = req.body.batchId;
  const sentOn = req.body.sentOn;
        const timestamp = new Date()
          .toISOString()
          .replace("T", " ")
          .slice(0, 19);
        console.log("query1 done");
        const query = `SELECT * FROM batch_stage WHERE batchId = ${batchId} and toOrg=${receiverOrg} and fromOrg=${userOrg}`;
        db.query(query, (err, result) => {
          if (err) res.status(400).send(err?.toString());
          else if (result?.length > 0)
            res
              .status(400)
              .send(
                "There is already a batch with this id forwarded from this organization."
              );
          else {
            db.query(
              "INSERT INTO batch_stage(batchId,fromOrg, toOrg,sentOn, sentBy,sentTo,lastUpdatedOn ) VALUES (?,?,?,?,?,?,?)",
              [
                batchId,
                userOrg,
                receiverOrg,
                sentOn,
                userId,
                receiver,
                timestamp,
              ],
              (err, result) => {
                if (err) {
                  res.status(400).send(err?.toString());
                } else {
                  console.log("query2 done");
                  res.send({
                    batchId: batchId,
                    message: "Batch has been forwarded successfully",
                  });
                }
              }
            );
          }
        });
      }
    );
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
