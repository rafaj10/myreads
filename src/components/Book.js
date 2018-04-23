import React, { Component } from 'react'
import PropTypes from 'prop-types';

class Book extends Component {

  handleChange(event) {
    const newShelf=event.target.value;
    console.log(newShelf);
  }

  render() {
    return (
      <div className='book'>
        <div className='book-top'>
          { this.props.bookItem.imageLinks && (<div
            className='book-cover'
            title={this.props.bookItem.id}
            style={{
              width: 128,
              height: 192,
              backgroundImage: `url(${this.props.bookItem.imageLinks.smallThumbnail || this.props.bookItem.imageLinks.thumbnail})`
            }}>
          </div> )}

          <div className='book-shelf-changer'>
            <form>
              <select value={this.props.bookItem.shelf} onChange={this.handleChange}>
                <option disabled>Move to...</option>
                <option value='currentlyReading'>Currently Reading</option>
                <option value='wantToRead'>Want to Read</option>
                <option value='read'>Read</option>
                <option value='none'>None</option>
              </select>
            </form>
          </div>
        </div>
        <div className='book-title'>{this.props.bookItem.title}</div>
        <div className='book-authors'>
          { this.props.bookItem.authors && this.props.bookItem.authors.map( (author,index) => (<p key={index}>{author}</p>)) }
        </div>
      </div>
    )
  }
}

Book.propTypes = {
  bookItem: PropTypes.object.isRequired
}

export default Book
