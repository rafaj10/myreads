import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import {Route, Link} from 'react-router-dom'
import ReactLoading from 'react-loading';
import SearchPage from './Pages/SearchPage';
import Shelf from './components/Shelf'

class BooksApp extends React.Component {

  state = {
    shelves: [{friendlyName:'Currently Reading', name:'currentlyReading'}, {friendlyName:'Want to Read', name:'wantToRead'}, {friendlyName:'Read', name:'read'}],
    books: [],
    loading: true,
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((shelvesObject) => this.setState({books: shelvesObject}))
      .then(() => { this.setState({loading: false}); })
      .catch((e) => {
        alert('Sorry apparently something went wrong :/ try again');
        return []})
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

  renderCategory(shelf){
    const books = this.state.books.filter(item => item.shelf === shelf.name);
    return <Shelf shelfItem={shelf} books={books} updateBook={this.updateBook.bind(this)} key={shelf.name} />;
  }

  render() {
    return (
      <div className="app">
          <Route
            exact
            path="/search/"
            render={() => (<SearchPage compareAndUpdateBooks={this.compareAndUpdateBooks.bind(this)} updateBook={this.updateBook.bind(this)} />)}/>

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
