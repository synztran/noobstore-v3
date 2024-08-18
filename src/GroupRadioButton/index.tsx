import { VNCity } from '@/components/constants';
import SelectWithIcon from '@/components/selectWIcon';
import { CountryFlag } from '@/constants';
import { ENUM_CHECKOUT_COLLAPSE_TYPE } from '@/constants/Enums';
import { classNames } from '@/utils/AppConfig';
import { Box, Collapse, TextField } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { FormikErrors } from 'formik';
import Image from 'next/image';
import * as React from 'react';
import styles from './styles.module.css';

interface Props {
    options: {
        id: number
        name: string
        value: string | number | boolean
        imageUrl?: string[]
        disabled?: boolean
        textRight?: string
        imagesRight?: string[]
        isHaveCollapse?: boolean
        collapseType?: ENUM_CHECKOUT_COLLAPSE_TYPE
    }[]
    iconPosition?: "left" | "right"
    isBorder?: boolean
    value: string
    error?: boolean
    handleChangeValue: (value: React.ChangeEvent<HTMLInputElement>) => void
    helperText?: string
    title?: string
    subTitle?: string
    name?: string
    setValues?: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<{
      billing: {
        first_name: string;
        last_name: string;
        company: string;
        address: string;
        apartment: string;
        provice: string;
        post_code: string;
        phone_number: string
      };
  }>>
}

export default function GroupRadioButton(props: Props) {
  const { options, isBorder = false, value, handleChangeValue, helperText, error, title = '', subTitle = '', name } = props

  if (options.length === 0) return null

  return (
    <FormControl error={error} variant="standard">
      {
        title ? (
          <FormLabel className={styles.groupLabel}>{title}</FormLabel>
        ) : null
      }
      {
        subTitle ? (
          <FormLabel className={styles.groupSubtitle}>{subTitle}</FormLabel>
        ) : null
      }
      {
        options?.length === 1 ? (
          <>
            {
              <label className={styles.groupOnlyOne}>
                <FormControlLabel className='!mx-0' value={options[0]?.value} control={<Box />} label={options[0]?.name} disabled={options[0]?.disabled} />
                <label className={classNames(`ml-auto text-right flex-1`, options[0]?.textRight ? `flex align-middle` : "" )}>
                  {
                    options[0]?.imagesRight ? (
                      <>
                        {options[0]?.imagesRight?.map((text, idx) => (
                          <span key={idx} className={styles.imageRight}>
                            <Image src={text} objectFit='contain' layout='fill' alt='text right' />
                          </span>
                        ))}
                      </>
                    ) : null
                  } 
                  {
                    options[0]?.textRight ? (
                      <span className={styles.textRight}>{options[0]?.textRight}</span>
                    ) : null
                  }
                </label>
              </label>
            }
          </>
        ) : (
          <RadioGroup
            aria-labelledby="demo-error-radios"
            name={props.name}
            value={value}
            onChange={handleChangeValue}
            className={`${isBorder ? "border border-gray-500 rounded-md" : ""} ${styles.mainGroup}`}
          >
            {
              options?.map(child => {
                if (child?.textRight || child?.imagesRight) {
                  return (
                    <>
                      <label className={styles.groupOption}>
                        <FormControlLabel className='!mx-0' value={child?.value} control={<Radio />} label={child?.name} disabled={child?.disabled} />
                        <label className={classNames(`ml-auto text-right flex-1`, child?.textRight ? `flex align-middle` : "" )}>
                          {
                            child?.imagesRight ? (
                              <>
                              {child?.imagesRight?.map((text, idx) => (
                                  <span key={idx} className={styles.imageRight}>
                                    <Image src={text} objectFit='contain' layout='fill' alt='text right' />
                                  </span>
                                ))}
                              </>
                            ) : null
                          } 
                          {
                            child?.textRight ? (
                              <span className={styles.textRight}>{child?.textRight}</span>
                            ) : null
                          }
                        </label>
                      </label>
                      {
                        name === "billingAddress" && child?.isHaveCollapse && child?.collapseType === ENUM_CHECKOUT_COLLAPSE_TYPE.NEW_ADDRESS ? (
                          <CollapseNewBillingAddress checked={value === child?.value} />
                        ) : null
                      }
                    </>
                  )
                }

                return (
                  <>
                    <FormControlLabel className={styles.groupOption} value={child?.value} control={<Radio />} label={child?.name} disabled={child?.disabled} />
                    {
                      name === "billingAddress" && child?.isHaveCollapse && child?.collapseType === ENUM_CHECKOUT_COLLAPSE_TYPE.NEW_ADDRESS ? (
                        <CollapseNewBillingAddress checked={value === child?.value} />
                      ) : null
                    }
                  </>
                )
              })
            }
          </RadioGroup>
        )
      }
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

const CollapseNewBillingAddress = ({checked = false, setValues}: {checked: boolean, setValues?: any}) => {
  console.log("checked", checked)
  return (
    <Collapse in={checked}>
      <FormControl className={styles.collapseCotainer}>
        <div>
          <label>Quốc gia</label>
          <SelectWithIcon selectList={CountryFlag} />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label>Họ</label>
            {/* <Field name="first_name" type="text" placeholder="Họ" className="h-12 rounded-sm border border-gray-400 px-4 py-2" /> */}
            <TextField name='first_name' type='text' placeholder='Họ' variant='outlined'
              InputProps={{
                className: styles.collapseInput, 
             }}
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label>Tên</label>
            <TextField name="last_name" type="text" placeholder="Tên" className="h-12 rounded-sm border border-gray-400" variant='outlined' 
              InputProps={{
                className: styles.collapseInput, 
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label>Công ty</label>
          <TextField name="company" type="text" placeholder="Công ty (không bắt buộc)" 
            variant='outlined'
            InputProps={{
              className: styles.collapseInput, 
            }}
          />
        </div>
        <div className="flex flex-col w-full">
          <label>Địa chỉ</label>
          <TextField name="address" type="text" placeholder="Địa chỉ" 
            variant='outlined'
            InputProps={{
              className: styles.collapseInput, 
            }}
          />
        </div>
        <div className="flex flex-col w-full">
          <label>Chung cư, căn hộ, etc. </label>
          <TextField name="apartment" type="text" placeholder="Chung cư, căn hộ, etc. (không bắt buộc)" 
            variant='outlined'
            InputProps={{
              className: styles.collapseInput, 
            }}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col w-1/3">
            <label>Thành phố</label>
            <SelectWithIcon selectList={VNCity} isIcon={false} />
          </div>
          <div className="flex flex-col w-1/3">
            <label>Huyện/Xã</label>
            <TextField name="provice" type="text" placeholder="Huyện/Xã"
              variant='outlined'
              InputProps={{
                className: styles.collapseInput, 
              }}
            />
          </div>
          <div className="flex flex-col w-1/3">
            <label>Mã bưu cục</label>
            <TextField name="post_code" type="text" placeholder="Mã bưu cục" 
              variant='outlined'
              InputProps={{
                className: styles.collapseInput, 
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label>Số điện thoại</label>
          <TextField name="phone_number" type="text" placeholder="Số điện thoại" 
              variant='outlined'
              InputProps={{
                className: styles.collapseInput, 
              }}
          />
        </div>
      </FormControl>
    </Collapse>
  )
} 