
import React from 'react';
import { Image } from '@themesberg/react-bootstrap';

import "../css/preloader.css";

import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";


export default (props) => {

  const { show } = props;

  return (
    <div className={`preloader ${show ? "" : "show"}`}>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/lib-18147.appspot.com/o/images%2FLeras-logo.png?alt=media&token=57f65473-2f3a-45cb-b207-d00cb4ed574f"
        alt="Leras Logo"
        className="preloader-logo"
      />
    </div>
  );
};
