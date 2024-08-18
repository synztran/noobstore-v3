import { classNames } from '@/utils/AppConfig';
import { alpha } from '@material-ui/core/styles';
import { TextField } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { ChangeEventHandler } from "react";

const useStylesTextField = makeStyles((theme: any) => ({
  root: {
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#fcfcfb',
    height: 60,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontSize: '14px',
    boxShadow: 'none',
    paddingTop: '.5rem',
    '&:hover': {
      backgroundColor: '#fff',
      boxShadow: 'none',
    },
    '&$focused': {
      backgroundColor: '#fff',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
  focused: {},
}));

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '8px 0',
    border: '1px solid #e2e2e1 !important',
    borderRadius: 8,
    width: '100%',
    '@media screen and (max-width: 767px)': {
      width: '100%',
      marginLeft: 0,
      marginRight: 0,
    },
    '& .MuiInputLabel-asterisk': {
      color: 'red',
    },
    '& .MuiSelect-select': {
      height: 60,
    },
    '& .MuiInputBase-input': {
      boxShadow: 'none',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#fff',
      height: 60,
      borderRadius: 8,
      boxShadow: 'none',
      '&:focus-within': {
        backgroundColor: '#fff',
      },
      '&:before': {
        content: 'unset',
      },
      '&:after': {
        content: 'unset',
      },
    },
    "& .MuiFormLabel-root": {
      color: "#000",
      paddingTop: '4px',
    }
  },
}));

function CustomTextField(props: any) {
  const classes = useStylesTextField();

  return <TextField InputProps={{ classes }} {...props} />;
}


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
  min?: number;
}

const SimpleInputV1 = ({ label, id = '', className = '', ...restProps }: Props) => {
  const classes = useStyles();
  return (
    <CustomTextField
      label={label}
      className={className ? classNames(classes.root, className) : classes.root}
      variant="filled"
      id={id}
      {...restProps}
    />
  );
};


export default SimpleInputV1