import * as React from 'react';
export default function Checkbox(props) {
    const { value, onChange, label, name, className } = props;
    return (
        <label className={`checkbox-wrap ${className}`}>
            {label}
            <input type="checkbox" value={value} onChange={onChange} name={name} key={label} checked={value} />

            <span className="checkmark"></span>
        </label>

    );
}
