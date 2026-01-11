import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useRef } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";

const HeaderUserSetting = () => {
  const {
    user,
    logout,
    isAuthenticated = false,
  } = useAuth() as unknown as {
    user: IAuthUser;
    logout: () => void;
    isAuthenticated: boolean;
  };

  const settingOpts = [
    {
      name: "Thông tin tài khoản",
      href: "/account#detail",
      icon: "",
    },
    {
      name: "Đơn hàng",
      href: "/account#orders",
      icon: "",
    },
    {
      name: "Raffles",
      href: "/account#raffleHistory",
      icon: "",
    },
    {
      name: "Đăng xuất",
      icon: "",
      action: logout,
    },
  ];

  return (
    <Popover className="relative">
      {({ open, close }) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        return (
          <div
            onMouseEnter={() => {
              if (!open && buttonRef.current) {
                buttonRef.current.click();
              }
            }}
            onMouseLeave={() => {
              if (open) close();
            }}
          >
            <Popover.Button
              ref={buttonRef}
              className={`rounded-xl px-2 py-1 bg-gray-200 hover:bg-gray-300 focus:outline-none transition-all duration-150 ${
                open ? "ring-2 ring-indigo-500 ring-offset-2" : ""
              }`}
            >
              <div className="flex gap-2 items-center">
                <span className="rounded-full p-1">
                  {user?.avatar ? (
                    <div className="relative w-[36px] h-[36px] shadow-md bg-white rounded-full ">
                      <Image
                        src={user?.avatar}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        className="rounded-full object-contain p-0.5"
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="p-0.5 shadow-md rounded-full bg-white">
                      <AccountCircleIcon
                        style={{
                          width: 36,
                          height: 36,
                        }}
                      />
                    </div>
                  )}
                </span>
                <span className="text-lg">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-4 top-full z-10 mt-3 w-screen max-w-max overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-2">
                  {settingOpts.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-200"
                    >
                      {/* <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
												<item.icon
													className="h-6 w-6 text-gray-900 group-hover:text-indigo-600"
													aria-hidden="true"
												/>
											</div> */}
                      <div className="flex-auto">
                        {item.action ? (
                          <button className="" onClick={item.action}>
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            className="block font-semibold text-gray-900"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </div>
        );
      }}
    </Popover>
  );
};

export default HeaderUserSetting;
