import React, {useState} from 'react';
import './FeatureEditor.css';

const FeatureEditor = ({ selectedMarker, setSelectedMarker, markers, setMarkers }) => {
  const [featureType, setFeatureType] = useState('point');
  const [name, setName] = useState('');
  const [multilingualNames, setMultilingualNames] = useState({
    english: '',
    french: '',
    lao: ''
  });

  const handleSave = () => {
    if (!selectedMarker) return;
    
    const updatedMarkers = markers.map(marker => 
      marker === selectedMarker 
        ? { ...marker, name, type: featureType, multilingualNames }
        : marker
    );
    
    setMarkers(updatedMarkers);
    setSelectedMarker(null);
  };

  return (
    <div className="feature-editor">
      <h2>Edit Feature</h2>
      
      <div className="feature-section">
        <h3>Feature Type</h3>
        <select
          value={featureType}
          onChange={(e) => setFeatureType(e.target.value)}
          className="feature-select"
        >
          <option value="point">Point</option>
          <option value="line">Line</option>
          <option value="area">Area</option>
          <option value="building">Building</option>
          <option value="museum">Museum</option>
        </select>
      </div>

      <div className="feature-section">
        <h3>Fields</h3>
        
        <div className="field-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
          />
        </div>

        <div className="field-group">
          <label>Multilingual Name - English</label>
          <input
            type="text"
            value={multilingualNames.english}
            onChange={(e) => setMultilingualNames({
              ...multilingualNames,
              english: e.target.value
            })}
            className="field-input"
          />
        </div>

        <div className="field-group">
          <label>Multilingual Name - Lao</label>
          <input
            type="text"
            value={multilingualNames.lao}
            onChange={(e) => setMultilingualNames({
              ...multilingualNames,
              lao: e.target.value
            })}
            className="field-input"
          />
        </div>

        {featureType === 'museum' && (
          <>
            <div className="field-group">
              <label>Operator</label>
              <input
                type="text"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label>Type</label>
              <input
                type="text"
                className="field-input"
              />
            </div>
          </>
        )}
      </div>

      <div className="editor-actions">
        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="cancel-btn" onClick={() => setSelectedMarker(null)}>Cancel</button>
      </div>
    </div>
  );
};

export default FeatureEditor;