import React from "react";
import "antd/dist/antd.css";
import { Input } from "antd";


const SearchBar = () => {
 const { Search } = Input;

 

  return (
        <Search placeholder="input search text" />
  )    
}
export default SearchBar;
