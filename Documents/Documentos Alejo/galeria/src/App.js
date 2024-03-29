import React, { useState, useEffect } from 'react';
import { getImages, searchImages } from './api';
import './App.css';
import Principal from './principal';

const App = () => {
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const responseJson = await getImages();
      setImageList(responseJson.resources);
      setNextCursor(responseJson.next_cursor);
    };

    fetchData();
  }, []);

  const handleLoadMoreButtonClick = async () => {
    const responseJson = await getImages(nextCursor);
    setImageList((currentImageList) => [
      ...currentImageList,
      ...responseJson.resources,
    ]);
    setNextCursor(responseJson.next_cursor);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const responseJson = await searchImages(searchValue, nextCursor);
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
  };

  const resetForm = async () => {
    const responseJson = await getImages();
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);

    setSearchValue('');
  };

  const toggleImageSize = (imageId) => {
    setSelectedImageId(selectedImageId === imageId ? null : imageId);
  };

  return (
    <>
      <div>
        <Principal />
      </div>
      <form onSubmit={handleFormSubmit}>
        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          required='required'
          placeholder='Enter a search value...'
        ></input>
        <button type='submit'>Search</button>
        <button type='button' onClick={resetForm}>
          Clear
        </button>
      </form>
      <div className='image-grid'>
        {imageList.map((image) => (
			
          <img
            key={image.public_id}
            className={selectedImageId === image.public_id ? 'img-big' : 'img'}
            src={image.url}
            alt={image.public_id}
            onClick={() => toggleImageSize(image.public_id)}
          ></img> 


		  
        ))}
      </div>
      <div className='footer'>
        {nextCursor && (
          <button onClick={handleLoadMoreButtonClick}>Load More</button>
        )}
      </div>
    </>
  );
};

export default App;
