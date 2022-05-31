"use strict";

const mysql = require("mysql");
const AWS = require("aws-sdk");

class DatabaseHandler {
  config = {};
  credentialsForConnection = null;
  dbConnection = null;
  connectionStatus = null;

  constructor() {
    let dbParams = {
      name: process.env.DB_NAME,
      secretArn: process.env.SECRET_ARN_DB,
      secretName: process.env.SECRET_NAME_DB,
    };

    if (process.env.ENV === "dev") {  
      dbParams = {
        name: process.env.DB_NAME,
        credentials: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
        },
      };
    }

    this.config = dbParams;
  }

  getConditionsForWhereFromConditionsArray(conditionsArray) {
    return conditionsArray
      .map(({ condition }) => {
        return condition;
      })
      .join(" AND ");
  }

  getConditionsValuesFromConditionsArray(conditionsArray) {
    return conditionsArray.map(({ value }) => {
      return value;
    });
  }

  async getCredentialsFromSecret() {
    return new Promise((resolve, reject) => {
      const clientSecretManager = new AWS.SecretsManager();
      clientSecretManager.getSecretValue(
        { SecretId: this.config.secretName },
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data.SecretString));
          }
        }
      );
    });
  }

  
  async getCredentials() {
    let credentials = {};

    if (this.config.secretName) {
      credentials = await this.getCredentialsFromSecret();
    } else {
      credentials = this.config.credentials;
    }

    if (this.config.name) {
      credentials.database = this.config.name;
    } else if (credentials.dbName) {
      credentials.database = credentials.dbName;
    } else if (credentials.dbname) {
      credentials.database = credentials.dbname;
    }

    if (!credentials.user && credentials.username) {
      credentials.user = credentials.username;
    }

    if (this.config.host) {
      credentials.host = this.config.host;
    }

    if (this.config.port) {
      credentials.port = this.config.port;
    }

    return credentials;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.dbConnection.connect((err) => {
        if (err) {
          reject(err);
          return;
        }

        if (this.dbConnection.threadId === null) {
          reject(
            new Error(
              "Error to establish connection, ID of connection is null",
              err
            )
          );
          return;
        }

        this.connectionStatus = "connected";
        resolve(this.dbConnection.threadId);
      });
    });
  }

  async disconnect() {
    if (
      this.dbConnection &&
      this.dbConnection.threadId &&
      this.connectionStatus == "connected"
    ) {
      return new Promise((resolve, reject) => {
        this.dbConnection.end((err) => {
          if (err) {
            reject(err);
            return;
          }

          this.connectionStatus = "disconnected";
          resolve(true);
        });
      });
    }
  }

  async executeQuery(sql, values) {
    try {
      if (!this.dbConnection) {
        const credentialsForConnection = await this.getCredentials();

        this.dbConnection = mysql.createConnection({
          ...credentialsForConnection,
        });
      }

      if (!this.dbConnection.threadId) {
        await this.connect();
      }

      return new Promise((resolve, reject) => {
        this.dbConnection.query(sql, values, (err, results, fields) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(results);
        });
      });
    } catch (e) {
      console.error("Error in DatabaseHandler.executeQuery", e);
      throw e;
    }
  }
}

module.exports = DatabaseHandler;
