import { withAuthenticationRequired } from "@auth0/auth0-react";
import './App.css';

export const App = withAuthenticationRequired(function App() {
  return (
    <div className="App">
    </div>
  );
});
