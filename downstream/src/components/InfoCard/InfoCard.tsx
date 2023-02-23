import React from "react";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import "./InfoCard.scss";
import BainbridgeMatthew from "../../assets/bainbridge_matthew.jpg";
const Links = [
  {
    label: "Github",
    url: "https://github.com/mdkelley02",
    icon: <AiFillGithub />,
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/matthew-kelley-12b102184/",
    icon: <AiFillLinkedin />,
  },
];

export default function InfoCard() {
  return (
    <div className="info-container">
      <div className="info-container__header">
        <img
          className="bainbridge-matthew"
          src={BainbridgeMatthew}
          alt="Matthew Kelley"
        />
      </div>
      <div className="info-container__body">
        <p>Software Engineer @ Kount, Inc.</p>
        <p>Computer Science Student @ BSU</p>
      </div>
      <div className="info-container__footer chip-list">
        {Links.map((link, key) => (
          <a key={key} target="_blank" href={link.url}>
            <div className="icon-with-text chip">
              {link.icon}
              <span>{link.label}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
