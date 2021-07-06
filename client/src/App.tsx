import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./Components/Header";
import Home from "./Screens/Home";
import Meeting from "./Screens/Meeting";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/m/:id">
            <Meeting />
          </Route>
        </Switch>
      </Router>
    </>
  );
};
export default App;
