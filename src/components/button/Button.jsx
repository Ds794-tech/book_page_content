import React from "react";


const Button = ({ ...rest }) => {
    return (
        <button
            {...rest}
        >
            {rest.children}
        </button>
    );
}

export default Button;