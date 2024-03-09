import AutoComplate from "./components/AutoComplate/AutoComplate";
import "./App.scss";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
function App() {
  const [select, onSelect] = useState("");

  return (
    <div className="App">
      <h3>React Developer Employment Application Test</h3>
      <div className="autoCom">
        {/*error ? (
          "Something Went Wrong!"
        ) : isLoading ? (
          <CircularProgress />
        ) : (
          <AutoComplate data={data} label={"Movies"} onSelect={onSelect} />
        )*/}
        <AutoComplate label={"Movies"} onSelect={onSelect} />
      </div>
    </div>
  );
}

export default App;
