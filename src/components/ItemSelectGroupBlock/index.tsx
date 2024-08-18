import { EnumProductType, IOption } from "@/interface";
import { classNames } from "@/utils/AppConfig";
import { useStoreProductDetailAction } from "@/zustand/useProductDetail";
import { makeStyles } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LabelItemSelectedBlock } from "../constants";
import styles from './styles.module.css';

interface Props {
  options: IOption[]
  setSelectedOpt: Dispatch<SetStateAction<IOption>>
  toggleResetQuantity: Dispatch<SetStateAction<number>>
}

const useStyles = makeStyles(() => ({
  buttonGroupContainer: {
    display: "flex",
    gap: '12px !important',
    flexWrap: "wrap",
    marginTop: 4
  },
  buttonItem: {
    borderRadius: '4px !important',
    padding: '2px 8px !important',
    border: '1px solid #b1b1b1 !important',
    borderLeft: '1px solid #b1b1b1 !important',
    color: '#000 !important',
    '&.Mui-selected': {
      color: '#256f6e!important',
      borderColor: '#256f6e !important',
      background: '#256f6e0f !important'
    }
  },
}))

const ItemSelectGroupBlock = ({
  options,
  setSelectedOpt,
  toggleResetQuantity,
}: Props) => {
  const Styles = useStyles()
  const { updateOptSelected } = useStoreProductDetailAction()
  const [itemSelected, setItemSelected] = useState<IOption>();

  const productType = options?.map((option: any) => option.productType)?.[0] || ''

  console.log(productType, options)


  const handelSelectedItem = ( 
    event: React.MouseEvent<HTMLElement>,
    newValue: IOption
  ) => {
    if (newValue !== null && itemSelected?.index !== newValue?.index) {
      setItemSelected(newValue)
      setSelectedOpt(newValue)
      updateOptSelected(newValue)
    }
  }

  useEffect(() => {
    toggleResetQuantity(prev => prev + 1)
  }, [itemSelected])

  return (
    <div className={styles.container}>
      <span className={styles.label}>{LabelItemSelectedBlock[productType as EnumProductType]}</span>
      <ToggleButtonGroup
        value={itemSelected}
        exclusive
        onChange={handelSelectedItem}
        className={classNames(Styles.buttonGroupContainer, styles.parentContainer || '')}
      >
        {
          options.map((option: IOption, idx: number) => (
            <ToggleButton 
              key={idx} 
              value={option} 
              className={classNames(Styles.buttonItem)} 
              style={{textTransform: 'unset'}} 
            >
              {option.label}
            </ToggleButton>
          ))
        }
      </ToggleButtonGroup>
    </div>
  )
}

export default ItemSelectGroupBlock