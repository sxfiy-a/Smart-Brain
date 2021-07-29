import React from 'react';
import './ImageURLForm.css';

const ImageURLForm = ({ onInputChange, onDetect }) => {
    return(
        <div>
            <p className="f3 white">
                {'This brain will detect faces in your pictures. Give it a try.'}
            </p>
            <div className='center'>
                <div className="form center pa4 br3 shadow-5">
                    <input 
                        className="f4 pa2 w-70 center " type="text" 
                        onChange={onInputChange}
                    />
                    <button 
                        className="w-30 grow f4 link ph3 pv2 dib black bg-grey"
                        onClick={onDetect}
                    >Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageURLForm;