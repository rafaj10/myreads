import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Book from './Book'

class Shelf extends Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelfItem.friendlyName}</h2>
        {this.props.books.length > 0 ? (
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books.map((item) => (
              <li key={item.id}>
                <Book bookItem={item} updateBook={this.props.updateBook} />
              </li>
            ))
            }
          </ol>
        </div>
        ) : (
            <div> Nothing here </div>
          ) }
      </div>
    )
  }
}

Shelf.propTypes = {
  shelfItem: PropTypes.object.isRequired,
  books: PropTypes.array.isRequired
}

export default Shelf