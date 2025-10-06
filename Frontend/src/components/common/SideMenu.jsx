import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { setBreadcrumb } from "../../slices/breadcrumbSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const SideMenu = ({ navItems, dropdownItems, pathname }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleAccordion = (label) => {
    setOpenAccordion(openAccordion === label ? null : label);
  };
  return (
    <div className="side_menu_responsive_mobile">
      {/* Menu Icon */}
      <button className="" onClick={toggleMenu}>
        <svg
          width="61"
          height="47"
          viewBox="0 0 61 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.602051"
            y="1.21225"
            width="59"
            height="45"
            rx="4.5"
            fill="white"
            stroke="#D9D9D9"
          />
          <path
            d="M19.1021 24.7122H41.1021C41.6543 24.7122 42.1021 24.2645 42.1021 23.7122C42.1021 23.16 41.6543 22.7122 41.1021 22.7122H19.1021C18.5498 22.7122 18.1021 23.16 18.1021 23.7122C18.1021 24.2645 18.5498 24.7122 19.1021 24.7122Z"
            fill="#1C1C1C"
          />
          <path
            d="M19.1021 16.7122H41.1021C41.6543 16.7122 42.1021 16.2645 42.1021 15.7122C42.1021 15.16 41.6543 14.7122 41.1021 14.7122H19.1021C18.5498 14.7122 18.1021 15.16 18.1021 15.7122C18.1021 16.2645 18.5498 16.7122 19.1021 16.7122Z"
            fill="#1C1C1C"
          />
          <path
            d="M19.1021 32.7122H41.1021C41.6543 32.7122 42.1021 32.2645 42.1021 31.7122C42.1021 31.16 41.6543 30.7122 41.1021 30.7122H19.1021C18.5498 30.7122 18.1021 31.16 18.1021 31.7122C18.1021 32.2645 18.5498 32.7122 19.1021 32.7122Z"
            fill="#1C1C1C"
          />
        </svg>
      </button>

      {/* Side Menu */}
      <Offcanvas isOpen={isOpen} toggle={toggleMenu} direction="end">
        <OffcanvasHeader toggle={toggleMenu}></OffcanvasHeader>
        <OffcanvasBody>
          <Nav vertical>
            <ul>
              {navItems.map(({ path, label }) => (
                <li
                  key={path}
                  className={`border-0 shadow-sm py-2 px-3 mb-2 nav-item position-relative ${
                    label === "About Us" || label === "Specialties"
                      ? "dropdown"
                      : ""
                  } ${pathname === path ? "side_menu_item_active" : ""}`}
                >
                  {label === "About Us" || label === "Specialties" ? (
                    <>
                      <button
                        className="w-100 d-flex justify-content-between align-items-center bg-transparent border-0 p-0"
                        style={{ outline: "none" }}
                      >
                        <span
                          onClick={() => {
                            dispatch(setBreadcrumb(["Home", label]));
                            navigate(path);
                            setIsOpen(false);
                          }}
                          className={
                            pathname === path
                              ? "side_menu_item_active f-w-600"
                              : ""
                          }
                        >
                          {label}
                        </span>
                        <FaChevronDown
                          onClick={() => handleAccordion(label)}
                          className={`text-muted ms-2 transition-transform ${
                            openAccordion === label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openAccordion === label && (
                        <ul className="dropdown-menu shadow bg-white show position-static mt-2 w-100">
                          {dropdownItems[label].map((item) => (
                            <li key={item.path}>
                              <Link
                                to={
                                  label === "Specialties"
                                    ? `/${item.id}`
                                    : item.path
                                }
                                className="dropdown-item"
                                onClick={() => {
                                  dispatch(
                                    setBreadcrumb(["Home", item.label])
                                  );
                                  setIsOpen(false);
                                }}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={path}
                      className={
                        pathname === path ? "side_menu_item_active f-w-600" : ""
                      }
                      onClick={() => {
                        dispatch(setBreadcrumb(["Home", label]));
                        setIsOpen(false);
                      }}
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Nav>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
};

export default SideMenu;
