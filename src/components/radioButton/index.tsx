import { classNames } from "@/utils/AppConfig";
import Image from "next/image";

interface Props {
    options: {
        id: number,
        name: string,
        value: string | number,
        imageUrl?: string[],
        disabled?: boolean;
    }[],
    iconPosition?: "left" | "right",
    isVertical?: boolean,
    isBorder?: boolean,
    isSpacing?: boolean
}

const RadioButton = ({options, isVertical = false, isBorder = false, isSpacing = true}:Props) => {
    if (!options) return null

    return (
      <div className={classNames("flex gap-2", isVertical ? 'flex-col' : '')}>
        {
          options?.map(child => (
            <div key={child.id} className={classNames("flex items-center gap-2 rounded-md hover:bg-gray-200 pr-2", isBorder ? 'border border-gray-400 checkbox-label' : '', isSpacing ? "w-full" : '')}>
              <input className=" checked:bg-gray-400 text-gray-500 p-2 my-2 outline-none shadow-none focus:[box-shadow:none]" type="radio" id={child.id.toString()} name="radio" value={child.value} />
              <label htmlFor={child.id.toString()} className={classNames("flex justify-between items-center", isSpacing ? "w-full" : "")}>
                  {child.name}
                <div>
                  {
                    child?.imageUrl && child?.imageUrl.length > 0 && child?.imageUrl?.map((icon, idx) => (
                      <Image
                        src={icon}
                        alt={`icon-${idx}`}
                        width={20}
                        height={20}
                      />
                    ))
                  }
                </div>
              </label>
            </div>
          ))
        }
      </div>
    );
}

export default RadioButton