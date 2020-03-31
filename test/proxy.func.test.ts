import {describe, it, before, after} from "mocha";
import {expect} from "chai";
import * as express from "express";
import * as supertest from "supertest";
import Axios, {AxiosRequestConfig} from "axios";

describe("proxyhandler functional tests", function () {
  this.timeout(10000);

  let server = null;

  before((done) => {
    (async () => {
      const app = express();

      app.use("/echo", (req, res) => {
        res.status(200);
        const keys = Object.keys(req.headers);
        for (const key of keys) {
          res.set(key, req.headers[key]);
        }
        res.send(req.body);
      });

      server = app.listen(9999);
    })().then(done).catch(done);
  });

  after((done) => {
    (async () => {
      await server.close();
    })().then(done).catch(done);
  });

  it("Happy path GET echo", (done) => {
    (async () => {
      const app = express();
      const {ProxyHandler, ProxyResponseHandler} = require("../src");
      app.use("/proxy", [
        ProxyHandler({
          proxyService: {
            resolveRequest: async (req): Promise<AxiosRequestConfig> => {
              return {
                url: `http://localhost:9999/echo`,
                method: req.method,
                headers: {
                  "myheader": "echo"
                },
                data: req.body
              };
            }
          }
        }),
        ProxyResponseHandler()
      ] as any);
      const response: any = await new Promise((resolve, reject) => {
        supertest(app)
          .get('/proxy')
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
      });
      expect(response.status).to.be.equals(200);
      expect(Object.keys(response.body).length).to.be.equals(0);
      expect(Object.keys(response.headers).length).to.be.equals(10);
      expect(response.headers.myheader).to.be.equals("echo");
    })().then(done).catch(done);
  });
});
