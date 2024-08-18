import { classNames } from '@/utils/AppConfig';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@mui/styles';
import { ChangeEventHandler } from "react";
import styles from './styles.module.css';


interface Props {
  id?: string;
  label?: string;
  type?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>; // Update the type of onChange
  className?: string; // Add className property to Props interface
  inputProps?: {
    [x: string]: string | number
  }
  onInput?: (e: any) => void
  defaultValue?: string | number
  helperText?: string
  options?: any[]
  value?: string | number
}

const simpleSelectV2UseStyles = makeStyles((theme: any) => ({
  root: {
    overflow: 'hidden',
    borderRadius: '8px !important',
    backgroundColor: '#fcfcfb',
    height: 60,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontSize: '14px',
    boxShadow: 'none',
    padding: '0!important',
    "& .Mui-selected": {
      backgroundColor: "pink",
      color: "red",
      fontWeight: "bold",
    },
    "& .Mui-selected:hover": {
      backgroundColor: "tomato"
    },
    "& .MuiFormLabel-root": {
      color: "#000",
      paddingTop: '4px',
    },
    "& .MuiInputBase-root": {
      margin: '0!important'
    },
    "& .MuiSelect-root": {
      padding: '32px 32px 8px 12px'
    },
    "& .MuiSelect-root:hover": {
      backgroundColor: 'rgba(0, 0, 0, 0.09)',
      border: 'none'
    }
  }
}));

const SimpleSelectV2 = ({ label, id = '', className = '', variant = 'outlined', ...restProps }: Props) => {
  const classes = simpleSelectV2UseStyles();
  return (
    <FormControl fullWidth>
      <InputLabel className={styles.labelRoot}>{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        classes={{
          select: styles.select
        }}
        className={classNames(classes.root, className)}
        variant={variant}
        {...restProps}
      >
        {
          restProps.options?.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};


export default SimpleSelectV2