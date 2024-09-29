"use client";

import { useState, useEffect } from "react";
import "./sidebar.css";
import Image from "next/image";
import logo from "../Images/shoesync logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiMoneyBold } from "react-icons/pi";
import { PiSneakerBold } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { GiCycle } from "react-icons/gi";

const Sidebar = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("/dashboard");

  useEffect(() => {
    setSelected(router.pathname);
  }, [router.pathname]);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", logo: <RxDashboard /> },
    { name: "Inventory", path: "/inventory", logo: <PiSneakerBold /> },
    { name: "Profit & Sales", path: "/sales", logo: <PiMoneyBold /> },
    { name: "Return", path: "/return", logo: <GiCycle /> },
  ];

  return (
    <div className="sidebar">
      <div className="flex gap-5 items-center">
        <Image src={logo} alt="Logo" width={40} height={30} />
        <h1 className="logo-name">ShoeSync</h1>
      </div>

      <ul className="menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link href={item.path}>
              <div
                className={`menu-item ${
                  selected === item.path ? "active" : ""
                }`}
                onClick={() => setSelected(item.path)}
              >
                <div className="flex items-center gap-5">
                  {item.logo}
                  <h1>{item.name}</h1>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
