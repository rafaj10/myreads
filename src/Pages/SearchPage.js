import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading';
import Book from '../components/Book'
import * as BooksAPI from '../BooksAPI';

class SearchPage extends Component {

  state = {
    query: '',
    searchResults: [],
    searchHasStart: false,
    loadingSearch: false
  }

  componentWillUnmount() {
    this.cleanSearch();
  }

  cleanSearch(){
    this.setState({ searchResults: [], query: '', searchHasStart: false });
  }

  updateQuery = (query) => {
    this.setState({ query: query });
    if(this.state.query.length > 1){
      this.setState({ query: query, searchHasStart:true, loadingSearch:true });
      BooksAPI.search(this.state.query)
        .then((shelvesObject) => this.handleSearch(shelvesObject))
        .catch((e) => {
          this.setState({ loadingSearch:false });
          alert('Sorry apparently something went wrong :/ try again AQ ' + JSON.stringify(e));
          return []})
    }
  }

  handleSearch(shelvesObject) {
    this.setState({ loadingSearch:false });
    if(shelvesObject.error){
      this.setState({searchResults: []})
    }else if(shelvesObject && shelvesObject.length > 0){
      this.setState({searchResults: this.props.compareAndUpdateBooks(shelvesObject)})
    }
  }

  updateBooks(bookItem, newShelf){
    this.props.updateBook(bookItem, newShelf);
    this.setState({searchResults: this.props.compareAndUpdateBooks(this.state.searchResults)});
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            to='/'
            className='close-search' >Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          {this.state.loadingSearch && (
            <ReactLoading type='bubbles' color='#2e7c31' height={150} width={150} className="loading-list" />
          )}
          {!this.state.loadingSearch && this.state.searchHasStart && this.state.searchResults.length === 0 ? (
            <div className='close-nothing'>Oops nothing found try again :)</div>
          ) : (
            <ol className="books-grid">
              {this.state.searchResults.map((item) => (
                <li key={item.id}>
                  <Book bookItem={item} updateBook={this.updateBooks.bind(this)} />
                </li>
              ))
              }
            </ol>
          )}
        </div>
      </div>
    )
  }
}

SearchPage.propTypes = {
  compareAndUpdateBooks: PropTypes.func.isRequired,
  updateBook: PropTypes.func.isRequired
}

export default SearchPage
