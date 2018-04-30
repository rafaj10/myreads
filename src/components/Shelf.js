import React from 'react'
import PropTypes from 'prop-types';
import Book from './Book'

const Shelf = function (props) {
  return (
    <div className="bookshelf">
      <h2
        className="bookshelf-title">{props.shelfItem.friendlyName}</h2>
      {props.books.length > 0 ? (
        <div className="bookshelf-books">
          <ol className="books-grid">
            {props.books.map((item) => (
              <li key={item.id}>
                <Book bookItem={item}
                      updateBook={props.updateBook}/>
              </li>
            ))
            }
          </ol>
        </div>
      ) : (
        <div className='bookshelf-nothing'>Nothing here
          :/</div>
      )}
    </div>
  );
};

Shelf.propTypes = {
  shelfItem: PropTypes.object.isRequired,
  books: PropTypes.array.isRequired,
  updateBook: PropTypes.func.isRequired
}

export default Shelf