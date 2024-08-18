import { Box } from '@material-ui/core';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Rating } from "@mui/material";
import { useState } from "react";

interface Props {
  star: number;
  reviewer?: number;
  disabled?: boolean;
  readonly?: boolean;
}

const RatingComponent = ({star = 0, reviewer = 0, disabled = false, readonly = false}: Props) => {
  const [ratingStart, setRatingStart] = useState<number>(star);

  return (
    <Box className='flex align-middle gap-2'>
      <Rating
        icon={<StarIcon style={{fill: '#ff3833', width: 18, height: 18}} />}
        emptyIcon={<StarBorderIcon style={{fill: 'black', width: 18, height: 18}} />}
        className="text-yellow-400 my-auto"
        name="simple-controlled"
        value={ratingStart}
        onChange={(_, newValue) => {
          if (typeof newValue === 'number') {
            setRatingStart(newValue);
          }
        }}
        size='small'
        disabled={disabled}
        readOnly={readonly}
      />
      <div style={{lineHeight: '18px', paddingTop: 2}} className='text-sm'>{reviewer} đánh giá</div>
    </Box>
  )
}

export default RatingComponent;