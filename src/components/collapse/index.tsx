import { useState } from "react";
import { classNames } from "@/utils/AppConfig";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styles from "./styles.module.css";

const CollapseText = ({
  title,
  content,
  bgc = "#fff",
  id,
}: {
  title: string;
  content: string | React.ReactElement;
  bgc?: string;
  textColor?: string;
  id?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <section className="grid place-items-center mt-4 relative">
      <div className="w-full" style={{ backgroundColor: `${bgc}` }}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((prev) => !prev)}
          className={classNames(
            "flex h-12 cursor-pointer items-center font-bold w-full justify-between px-4 py-0 rounded-lg",
            styles.shadow || ""
          )}
          style={{ backgroundColor: `${bgc}` }}
        >
          <span>{title}</span>
          <span
            className={classNames(
              "transition-transform duration-200",
              open ? "rotate-90" : "rotate-0"
            )}
          >
            <KeyboardArrowRightIcon />
          </span>
        </button>
        <div
          id={id}
          className={classNames(
            "overflow-hidden transition-all duration-100 px-4 shadow-md rounded-br-lg rounded-bl-lg relative -top-2 overflow-y-auto",
            open ? "max-h-[30vh] py-2 " : "max-h-0 py-0"
          )}
          style={{
            backgroundColor: `${bgc}`,
          }}
        >
          <div
            className="mb-2 text-gray-700 text-sm"
            dangerouslySetInnerHTML={{ __html: content as string }}
          />
        </div>
      </div>
    </section>
  );
};

export default CollapseText;
