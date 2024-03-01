import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"

import { Fragment, useState } from "react";
import { Dialog, Disclosure, Popover, Transition,Menu } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { publicAxios } from "../../config/publicAxios";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../store/reducer/reducer";


interface Category {
  categoryId: number;
  nameCategory: string;
  description: string;
  href:any
}
interface CallToAction {
  name: string;
  href: string;
  icon: React.ElementType;
}
interface UserLogin {
  userId: number;
  userName: string;
  cart: any[]; // You might want to replace 'any[]' with the actual type of cart items
}


const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join("");
}



const Header = (props: any) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate()
  const cart = useSelector((state:any)=>{
    return state.cartSlices.cart.data;
  })
  const dispatch = useDispatch()
  const [userLogin,setUserLogin] = useState <UserLogin>(
    JSON.parse(localStorage.getItem("user_login")||"{}")
  )
  const handleLogout = () => {
    localStorage.clear();
    // setUserLogin({});
    // setIsLogin(false);
    window.location.href = "/login";
  };
  const handleClickCategory = (id:number)=>{
    localStorage.setItem('category',JSON.stringify(id));
    navigate(`category/${id}`)
  }
 
  
  const [category,setCategory] = useState<Category[]>([])
  const getCategory = async()=>{
    const result = await publicAxios.get("/api/v1/categories")
    setCategory(result.data)
  }
  useEffect(()=>{
    getCategory();
    setUserLogin(JSON.parse(localStorage.getItem("user_login") || "{}"))
    dispatch(getCart(userLogin?.userId))
  },[])
  // console.log(category);
  
  
  return (
    <div className="mb-[100px]">
      <header className="bg-white fixed w-[100%] " >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1 ">
          <Link to="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Link to="/">
              {" "}
              <img
                className="h-8 w-auto"
                src="https://theme.hstatic.net/200000549029/1000902525/14/logo.png?v=2926"
                alt=""
                style={{ width: 65, height: 40 }}
              />
            </Link>
          </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                Bộ sưu tập
                <ChevronDownIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
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
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {category.map((item) => (
                      <div
                        key={item.categoryId}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                      >
                        {/* <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <item.icon
                            className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                            aria-hidden="true"
                          />
                        </div> */}
                        <div className="flex-auto"
                        onClick={()=>handleClickCategory(item.categoryId)}
                        >
                          <Link
                            to={item?.href}
                            className="block font-semibold text-gray-900"
                          >
                            {item.nameCategory}
                            <span className="absolute inset-0" />
                          </Link>
                          <p className="mt-1 text-gray-600">
                            {item?.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                    >
                      <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                      {item.name}
                    </a>
                  ))}
                </div> */}
                </Popover.Panel>
              </Transition>
            </Popover>

            <Link
              to="/products"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              SẢN PHẨM
            </Link>
            <Link
              to="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              SẢN PHẨM MỚI
            </Link>
            <Link
              to="/bill"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              ĐƠN HÀNG
            </Link>
          </Popover.Group>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end ml-4">
          <Link
            to="#"
            className="text-lg font-semibold leading-6 text-gray-900"
          >
            <div className="InputContainer">
              <input
                placeholder="Search.."
                id="input"
                className="input"
                name="text"
                type="text"
              />
            </div>
          </Link>
          <Link
            to="#"
            className=" mt-[11px] ml-7 text-lg font-semibold leading-6 text-gray-900"
          >
            <Menu as="div" className="relative ml-3">
              <div>
                {userLogin && userLogin.userId ? (
                  <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <span style={{ backgroundColor: "white" }}>
                      {userLogin.userName}
                    </span>
                  </Menu.Button>
                ) : (
                  <span
                    style={{ backgroundColor: "white" }}
                    onClick={() => handleLogout()}
                  >
                    <i className="fa-solid fa-user"></i>
                  </span>
                )}
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        // to="/login"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                        onClick={handleLogout}
                      >
                        Sign out
                      </span>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>{" "}
          </Link>
          <Link
            to="/cartOther"
            className="mt-[11px] ml-7 text-lg font-semibold leading-6 text-gray-900"
          >
            <i className="fa-solid fa-bag-shopping">
              <span id="total-order">{cart?.length}</span>
            </i>
          </Link>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://theme.hstatic.net/200000549029/1000902525/14/logo.png?v=2926"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Bộ sưu tập
                          <ChevronDownIcon
                            className={classNames(
                              open ? "rotate-180" : "",
                              "h-5 w-5 flex-none"
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-2">
                          {category.map((item) => (
                            <Disclosure.Button
                              key={item.categoryId}
                              as="a"
                              href={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                              {item.nameCategory}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Link
                    to="/products"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Sản phẩm
                  </Link>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Sản phẩm mới
                  </a>
                  <Link
                    to="/bill"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Đơn hàng
                  </Link>
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </div>
  );
};

export default Header;
