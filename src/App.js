import { useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

import axios from "axios";
import useAxios, { configure } from "axios-hooks";

import Table from "./Table";

import './App.css';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND;

configure({
  axios,
  cache: false,
  defaultOptions: { useCache: false, ssr: false }
});

export const App = withAuthenticationRequired(function App() {
  const [{ data, loading, error }, refetch] = useAxios();
  const [ids, setIds] = useState([]);

  return (
    <div className="App h-100 container-xxl d-flex flex-column">
      <Table data={data ? data.users : []} total={data && data.total}
             refetch={refetch} loading={loading}
             ids={ids} setIds={setIds}
      />
      {error && (
        <div className="alert alert-danger" role="alert">
          Could not fetch data. Try again later.
        </div>)
      }
    </div>
  );
});
