import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ReactLoading from 'react-loading';
import Shelf from './components/Shelf'

class BooksApp extends React.Component {

  state = {
    shelves: [{friendlyName:'Currently Reading', name:'currentlyReading'}, {friendlyName:'Want to Read', name:'wantToRead'}, {friendlyName:'Read', name:'read'}],
    query: '',
    books: [],
    searchResults: [],
    loading: true,
    showSearchPage: false
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

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author"/>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
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
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
