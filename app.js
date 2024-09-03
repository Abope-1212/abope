const path = require("path");

const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const Admin2Route = require("./routes/admin2");
const homeRoute = require("./routes/home");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(Admin2Route.routes);

app.use(homeRoute);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Error" });
});
app.listen(5000);
