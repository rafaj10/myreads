import React from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import HomePage from './Pages/HomePage';
import SearchPage from './Pages/SearchPage';

class BooksApp extends React.Component {

  state = {
    books: [],
    loading: true
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((shelvesObject) => this.setState({books: shelvesObject}))
      .then(() => {
        this.setState({loading: false});
      })
      .catch((e) => {
        alert('Sorry apparently something went wrong :/ try again AQ HEY');
        return []
      })
  }

  updateBook(bookItem, newShelf) {
    const books = this.state.books;
    var newShelvesObjects = books.map(item =>
      item = books.find(book => item.id === bookItem.id) ? {
        ...item,
        shelf: newShelf
      } : item
    );
    if (!newShelvesObjects.find(book => book.id === bookItem.id)) {
      bookItem.shelf = newShelf;
      newShelvesObjects.push(bookItem);
    }
    this.setState({books: newShelvesObjects});
  }

  compareAndUpdateBooks(shelvesObject) {
    const {books} = this.state;
    const newShelvesObject = shelvesObject.map(item =>
      item = {
        ...item, shelf:
          books.find(book => book.id === item.id) ? books.find(book => book.id === item.id).shelf : 'none'
      }
    );
    return newShelvesObject;
  }

  render() {
    return (
      <div className="app">

        <Route
          exact
          path="/"
          render={() => (<HomePage
            updateBook={this.updateBook.bind(this)}
            books={this.state.books}
            loading={this.state.loading}/>)
          }/>

        <Route
          exact
          path="/search/"
          render={() => (<SearchPage
            updateBook={this.updateBook.bind(this)}
            compareAndUpdateBooks={this.compareAndUpdateBooks.bind(this)}/>)
          }/>

      </div>
    )
  }
}

export default BooksApp
