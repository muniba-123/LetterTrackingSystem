import React from "react";
import Preloader from '../Assets/images/loaderWhite.svg';
export default function Button(props) {
  let {
    label,
    onClick,
    icon,
    disabled = false,
    showBtnLoader = false,
    className,
    wrapperClass,
  } = props;
  return (
    <div className={`btn-wrap ${wrapperClass}`}>
      <button type="button" className={`button-primary ${className}`} onClick={onClick} disabled={disabled}>{
        showBtnLoader ?
          <img alt="" src={Preloader} className="btn-loader" /> :
          label
      }</button>
      {icon && <img alt="" src={icon} className="btn-icon" />}
    </div>
  );
}
