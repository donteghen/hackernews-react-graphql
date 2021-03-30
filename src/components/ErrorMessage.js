import React from 'react';

const ErrorMessage = (props) =>{
    return (
        <div>
            <h1>An Error occurred :(</h1>
            <button onClick={props.gobackCallback}>Go Back</button>
        </div>
    )
}

export default ErrorMessage;