import React, { useEffect, useState } from "react";
import "./AutoComplate.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import useClickOutside from "../../useClickOutside";
import { useQuery } from "react-query";
import { CircularProgress } from "@mui/material";

function AutoComplate({ label, onSelect }) {
  let [toggle, setToggle] = useState(false);
  let domNode = useClickOutside(() => {
    setToggle(false);
  });

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/movies");
    return await response.json();
  };

  const { isLoading, error, data } = useQuery("movies", fetchData, {
    cacheTime: 5 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
  });

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setSelectedItem(searchTerm);
    const filteredResults = filterData(searchTerm, data);
    setFilteredData(filteredResults);
  };

  const filterData = (searchTerm, originalData) => {
    return originalData.filter(
      (item) =>
        item.label.toLowerCase().includes(searchTerm) ||
        item.value.toString().toLowerCase().includes(searchTerm)
    );
  };

  const handleSelect = (selectedOption) => {
    onSelect(selectedOption);
    setSearchTerm(""); // Clear search term
    setSelectedItem(selectedOption); // Clear search term
    setToggle(false); // Hide suggestions
  };

  const highlightText = (text) => {
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return (
      <span>
        {parts.map((part, index) => (
          <span
            key={index}
            style={
              part.toLowerCase() === searchTerm.toLowerCase()
                ? { fontWeight: "bold", color: "blue" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="box-auto" ref={domNode}>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label={label}
          value={selectedItem}
          variant="outlined"
          onClick={(e) => setToggle(!toggle)}
          onChange={(event) => handleSearch(event)}
        />
      </Box>

      {toggle && (
        <div className="content">
          {error ? (
            <div className="error-message">
              Failed to load movies. Please try again.
            </div>
          ) : isLoading ? (
            <CircularProgress size={20} />
          ) : filteredData.length === 0 ? (
            <div className="item" onClick={() => setToggle(false)}>
              <span>No results found</span>
            </div>
          ) : (
            filteredData.map((option, index) => (
              <div
                key={index}
                className="item"
                onClick={() => handleSelect(option.label)}
                style={{
                  background:
                    selectedItem === option.label && "rgba(43, 43, 209, 0.103)",
                }}
              >
                <span className="option-label">
                  {highlightText(option.label)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AutoComplate;
