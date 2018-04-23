import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import {Route, Link} from 'react-router-dom'
import {debounce} from "lodash";
import ReactLoading from 'react-loading';
import Book from './components/Book';
import Shelf from './components/Shelf'

class BooksApp extends React.Component {

  state = {
    shelves: [{friendlyName:'Currently Reading', name:'currentlyReading'}, {friendlyName:'Want to Read', name:'wantToRead'}, {friendlyName:'Read', name:'read'}],
    query: '',
    books: [],
    searchResults: [],
    loading: true
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((shelvesObject) => this.setState({books: shelvesObject}))
      .then(() => {
        console.log(this.state.books);
        this.setState({loading: false});
      })
      .catch((e) => {
        console.log(e);
        return []})
  }

  renderCategory(shelf){
    const books = this.state.books.filter(item => item.shelf === shelf.name);
    return <Shelf shelfItem={shelf} books={books} key={shelf.name} />;
  }

  handleSearch(shelvesObject) {
    if(shelvesObject && shelvesObject.length > 0){
      console.log(shelvesObject);
      this.setState({searchResults: shelvesObject})
    }
  }

  cleanSearch(){
    this.setState({searchResults: [], query: ''})
  }

  updateQuery = (query) => {
    this.setState({ query: query })
    BooksAPI.search(this.state.query)
      .then((shelvesObject) => this.handleSearch(shelvesObject))
      .catch((e) => {
        console.log(e);
        return []})
  }

  render() {
    return (
      <div className="app">
          <Route
            exact
            path="/search/"
            render={() => (
              <div className="search-books">
                <div className="search-books-bar">
                  <Link
                    to='/'
                    onClick={() => (this.cleanSearch())}
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
                  <ol className="books-grid">
                    {this.state.searchResults.map((item) => (
                      <li key={item.id}>
                        <Book bookItem={item} />
                      </li>
                    ))
                    }
                  </ol>
                </div>
              </div>
            )}/>

          <Route
            exact
            path="/"
            render={() => (
              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>

                {this.state.loading ? (
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
            )}/>
      </div>
    )
  }
}

export default BooksApp
