import { preventKeyInNumber } from "@/utils/ValidateUtils";
import { Box, Tooltip, Typography } from "@mui/material";
import { Button } from "@/components/ReUIComponent/Button";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { CircleX, Info } from "lucide-react";
import React, { useState } from "react";

interface IProps {
  formik: any;
}
const MAX_OPTIONS = 4;
const limitMessage = "Chỉ có thể thêm tối đã 4 tùy chọn mua thêm.";
const ProductOptions: React.FC<IProps> = (props) => {
  const { formik } = props;
  const [options, setOptions] = useState([
    { part: "", material: "", price: "" },
  ]);

  const handleAddOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, { part: "", material: "", price: "" }]);
    }
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    formik.setFieldValue("productOptions", updatedOptions);
  };

  const handleOptionChange = (index: number, field: string, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...(updatedOptions[index] || {
        part: "",
        material: "",
        price: "",
      }),
      [field as keyof (typeof updatedOptions)[number]]: value,
    } as any;
    setOptions(updatedOptions);
    formik.setFieldValue("productOptions", updatedOptions);
  };

  return (
    <Box component="fieldset" className="border p-4 rounded-lg">
      <Typography component="legend" className="text-gray-500">
        Tùy chọn mua thêm
      </Typography>
      {options.map((option, index) => (
        <div
          key={index}
          className={`relative grid gap-2 ${index > 0 ? "mt-2" : ""}`}
          // style="grid-template-columns: 1fr 1fr 1fr 20px;"
          style={{ gridTemplateColumns: "1fr 1fr 1fr 60px" }}
        >
          <FormControl fullWidth>
            <InputLabel>Loại sản phẩm</InputLabel>
            <Select
              value={option.part}
              onChange={(e) =>
                handleOptionChange(index, "part", e.target.value)
              }
            >
              <MenuItem value="part1">Part 1</MenuItem>
              <MenuItem value="part2">Part 2</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Chất liệu</InputLabel>
            <Select
              value={option.material}
              onChange={(e) =>
                handleOptionChange(index, "material", e.target.value)
              }
              displayEmpty
            >
              <MenuItem value="material1">Material 1</MenuItem>
              <MenuItem value="material2">Material 2</MenuItem>
            </Select>
          </FormControl>
          <TextField
            inputProps={{
              inputMode: "numeric",
            }}
            label="Giá bán"
            variant="outlined"
            value={option.price}
            onChange={(e) => handleOptionChange(index, "price", e.target.value)}
            onKeyDown={preventKeyInNumber}
            onBlur={formik.handleBlur}
          />
          <Button
            className="min-h-[20px] p-0 border-none text-red-400 hover:rounded-lg"
            variant="outline"
            onClick={() => handleDeleteOption(index)}
          >
            <CircleX />
          </Button>
        </div>
      ))}
      {options.length < MAX_OPTIONS && (
        <div className="w-full flex justify-end items-center mt-2 gap-2">
          <Button
            variant="outline"
            className="flex items-center text-blue-600 border-blue-600"
            onClick={handleAddOption}
          >
            Thêm tùy chọn
          </Button>
          <Tooltip title={limitMessage}>
            <Info className="w-4 h-4" />
          </Tooltip>
        </div>
      )}
    </Box>
  );
};

export default ProductOptions;
