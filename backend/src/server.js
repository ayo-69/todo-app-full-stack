const app = require("./app");
const port = process.env.PORT || 3000;
const { connect } = require("./config/db");

const startServer = async () => {
  await connect();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
