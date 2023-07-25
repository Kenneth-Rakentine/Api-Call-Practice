import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const BookDetails = ({ book, onClose }) => {
  const [coverUrl, setCoverUrl] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const fetchCoverUrl = async () => {
      try {
        const response = await axios.get(
          `https://archive.org/metadata/${book.identifier}`
        )
        setCoverUrl(response.data.metadata.coverurl)
        setDescription(response.data.metadata.description || '')
      } catch (error) {
        console.error('Error fetching cover data:', error)
      }
    }

    fetchCoverUrl()
  }, [book.identifier])

  return (
    <div className='bookDetails'>
      <h2>
        <a
          href={`https://archive.org/details/${book.identifier}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {book.title}
        </a>
      </h2>
      <p className='descripTxt' >Author: </p> <p>{book.creator}</p>
      <p className='descripTxt' >Description: </p><p>{description}</p>
      <button onClick={onClose}>HIDE</button>
    </div>
  )
}

const Nav = () => {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [showGif, setShowGif] = useState(false)

  const handleChange = (event) => {
    setQuery(event.target.value)
  }

  const searchTerm = (query) => {
    return `${query} audiobook`
  }

  const handleSearch = async () => {
    try {
      const modifiedQuery = searchTerm(query)

      const response = await axios.get(
        `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
          modifiedQuery
        )}&fl[]=identifier,title,creator,subject,mediatype&rows=30&output=json`
      )

      const audiobooks = response.data.response.docs.filter(
        (book) => book.mediatype === 'audio'
      )

      setBooks(audiobooks)

      
      setShowGif(true)

      setTimeout(() => {
        setShowGif(false)
      }, 3000)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleBookClick = (book) => {
    setSelectedBook(book)
  }

  const handleCloseBookDetails = () => {
    setSelectedBook(null)
  }

  return (
    <div className='mainContainer'>
      <div className='headContainer'>
        <h1 className='headTxt'><a className='headTxt' href='/' onClick={() => window.location.reload()}>
            █▓▒▒░░░AUDIOBOOK SEARCH░░░▒▒▓█
          </a></h1>
        {showGif && ( 
          <img
            src="https://thumbs.gfycat.com/GrippingReflectingBasenji-max-1mb.gif"
            alt='Loading GIF'
            className='loadingGif'
          />
        )}
        <img src="https://media1.giphy.com/media/UoenEKiBDzhJFMQBgn/giphy.gif?cid=6c09b952hfxxkhr0ex0l20j8zwqqe3xgk723m4fsyq2yn8hm&ep=v1_stickers_related&rid=giphy.gif&ct=s" alt='ocean wave img' className='waveImg' />
      </div>

      <div className='detailContainer'>
        {selectedBook && (
          <BookDetails book={selectedBook} onClose={handleCloseBookDetails} />
        )}
      </div>

      <input
        className='srchInput'
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
      />

      <button className='srchButton' onClick={handleSearch}>
        FIND
      </button>

      <ul>
        {books.map((book) => (
          <ul className='resultContainer' key={book.identifier}>
            <strong>
              <a
                className='titleLinkButton'
                onClick={() => handleBookClick(book)}
              >
                {book.title}
              </a>
            </strong>
            by {book.creator}

            <div className='subjectContainer'>
              <h5 className='subhead'>
                Subject: <p className='subContent'> {Array.isArray(book.subject) ? book.subject.join(', ') : book.subject}</p>
              </h5>
            </div>
            <hr />
          </ul>
        ))}
      </ul>
    </div>
  )
}

  

export default Nav