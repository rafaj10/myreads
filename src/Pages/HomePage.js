import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading';
import Shelf from '../components/Shelf'

class HomePage extends Component {

  state = {
    shelves: [{friendlyName:'Currently Reading', name:'currentlyReading'}, {friendlyName:'Want to Read', name:'wantToRead'}, {friendlyName:'Read', name:'read'}]
  }

  renderCategory(shelf){
    const books = this.props.books.filter(item => item.shelf === shelf.name);
    return <Shelf shelfItem={shelf} books={books} updateBook={this.props.updateBook} key={shelf.name} />;
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        {this.props.loading ? (
          <ReactLoading type='bubbles' color='#2e7c31' height={300} width={300} className="loading-list" />
        ) : (
          <div className="list-books-content">
            <div>
              { this.state.shelves.map((item) => this.renderCategory(item)) }
            </div>
          </div>
        )}

        <div className="open-search">
          <Link
            to={`/search`}
          >Add a book</Link>
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  updateBook: PropTypes.func.isRequired,
  book: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
}

export default HomePage