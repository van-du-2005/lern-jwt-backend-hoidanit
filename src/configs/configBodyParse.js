import bodyParser from "body-parser";

const configBodyParse = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};

export default configBodyParse;
