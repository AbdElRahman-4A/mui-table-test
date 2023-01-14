import { Search } from "@mui/icons-material";
import { FormControl, Input, InputAdornment, InputLabel } from "@mui/material";
import React, { useEffect, useState } from "react";

type Props = {
  setValue: (value: any) => void;
  values: any[];
  searchKey: string;
};

const SearchInput = ({ setValue, values, searchKey }: Props) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!inputValue) setValue(values);

      const filteredValues = values.filter((value) => value[searchKey as any].includes(inputValue));
      setValue(filteredValues);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchKey, setValue, values]);

  return (
    <FormControl variant="standard">
      <InputLabel htmlFor="search">Search by email</InputLabel>
      <Input
        id="search"
        value={inputValue}
        onChange={handleOnChange}
        startAdornment={
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchInput;
