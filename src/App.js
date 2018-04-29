import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import {Route, Link} from 'react-router-dom'
import ReactLoading from 'react-loading';
import Book from './components/Book';
import Shelf from './components/Shelf'

class BooksApp extends React.Component {

  state = {
    shelves: [{friendlyName:'Currently Reading', name:'currentlyReading'}, {friendlyName:'Want to Read', name:'wantToRead'}, {friendlyName:'Read', name:'read'}],
    query: '',
    books: [],
    searchResults: [],
    searchHasStart: false,
    loading: true,
    loadingSearch: false
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((shelvesObject) => this.setState({books: shelvesObject}))
      .then(() => { this.setState({loading: false}); })
      .catch((e) => {
        alert('Sorry apparently something went wrong :/ try again');
        return []})
  }

  renderCategory(shelf){
    const books = this.state.books.filter(item => item.shelf === shelf.name);
    return <Shelf shelfItem={shelf} books={books} updateBook={this.updateBook.bind(this)} key={shelf.name} />;
  }

  updateQuery = (query) => {
    this.setState({ query: query });
    if(this.state.query.length > 1){
      this.setState({ query: query, searchHasStart:true, loadingSearch:true });
      BooksAPI.search(this.state.query)
        .then((shelvesObject) => this.handleSearch(shelvesObject))
        .catch((e) => {
          this.setState({ loadingSearch:false });
          alert('Sorry apparently something went wrong :/ try again');
          return []})
    }
  }

  updateBook(bookItem, newShelf){
    const books = this.state.books;
    var newShelvesObjects = books.map(item =>
      item = books.find(book => item.id === bookItem.id) ? {...item, shelf: newShelf} : item
    );
    if(!newShelvesObjects.find(book => book.id === bookItem.id)){
      bookItem.shelf = newShelf;
      newShelvesObjects.push(bookItem);
    }
    this.setState({books: newShelvesObjects});
    if(this.state.searchResults.length > 0){
      this.setState({searchResults: this.compareAndUpdateBooks(this.state.searchResults)});
    }
  }

  handleSearch(shelvesObject) {
    this.setState({ loadingSearch:false });
    if(shelvesObject.error){
      this.setState({searchResults: []})
    }else if(shelvesObject && shelvesObject.length > 0){
      this.setState({searchResults: this.compareAndUpdateBooks(shelvesObject)})
    }
  }

  compareAndUpdateBooks(shelvesObject){
    const { books } = this.state;
    const newShelvesObject = shelvesObject.map(item =>
      item = { ...item, shelf:
        books.find(book => book.id === item.id) ? books.find(book => book.id === item.id).shelf : 'none'
      }
    );
    return newShelvesObject;
  }

  cleanSearch(){
    this.setState({ searchResults: [], query: '', searchHasStart: false });
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
                  {this.state.loadingSearch && (
                    <ReactLoading type='bubbles' color='#2e7c31' height={150} width={150} className="loading-list" />
                  )}
                  {!this.state.loadingSearch && this.state.searchHasStart && this.state.searchResults.length === 0 ? (
                    <div className='close-nothing'>Oops nothing found try again :)</div>
                  ) : (
                    <ol className="books-grid">
                      {this.state.searchResults.map((item) => (
                        <li key={item.id}>
                          <Book bookItem={item} updateBook={this.updateBook.bind(this)} />
                        </li>
                      ))
                      }
                    </ol>
                  )}
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
