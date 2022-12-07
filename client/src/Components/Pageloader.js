import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
export default function Pageloader() {
    return (
        <div className="loader-overlay">
            <div className="loader-div">
                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin spinner" />
            </div>
        </div>
    )
}
